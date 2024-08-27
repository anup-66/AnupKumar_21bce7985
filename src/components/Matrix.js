
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import PieceRules from './PieceRules';
import pieceRules from "./PieceRules";
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#333',
    padding: '20px',
  },
  turnDisplay: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#FFF',
    fontWeight: 'bold',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 80px)',
    gridTemplateRows: 'repeat(5, 80px)',
    gap: '5px',
    backgroundColor: '#222',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
  },
  row: {
    display: 'contents',
  },
  cell: {
    width: '80px',
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    color: '#FF0000',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    border: '2px solid #222',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
};

const MatrixDisplay = () => {
  const [matrix, setMatrix] = useState([['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]);
  const [turn, setTurn] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerPieces, setPlayerPieces] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [placingPhase, setPlacingPhase] = useState(true);

  useEffect(() => {
    const socketConnection = io("http://localhost:5000");
    const name = prompt("what is your name")
    socketConnection.emit("join_game",{
          name
        });
    console.log(name);
    socketConnection.on("connect", (name) => {
      console.log("Connected to the server");
    });

    socketConnection.on("init", (data) => {
      setMatrix(data.matrix);
      setTurn(data.turn);
      setPlayerId(data.playerId);
      setPlayerPieces(data.playerPieces);
    });

    socketConnection.on("update", (data) => {
      setMatrix(data.matrix);
      setTurn(data.turn);
      if (placingPhase===false)
      {
      setPlayerId(data.turn)

      }
    });

    socketConnection.on("start_game", (data) => {
      setMatrix(data.matrix);
      setTurn(data.turn);
      setPlacingPhase(false);
    });

    socketConnection.on("invalid_move", (data) => {
      alert(data.message);
    });

    socketConnection.on("game_over", (data) => {
      alert(`Game Over! Player ${data.winner} wins!`);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.close();
    };
  }, []);

  const handleCellClick = (rowIndex, colIndex) => {
    if (placingPhase) {
      if (socket && playerPieces.length > 0 && isValidPlacement(rowIndex, colIndex)) {
        const piece = playerPieces.shift();  // Get the first piece from the array
        socket.emit("place_characters", {
          playerId,
          positions: [[rowIndex, colIndex, piece]]
        });
        setPlayerPieces([...playerPieces]);  // Update remaining pieces
      }
    } else {
      if (socket && matrix[rowIndex][colIndex].startsWith(turn)) {
        console.log("okokok");
        // Select the piece if it belongs to the current player
        setSelectedPiece({ row: rowIndex, col: colIndex ,piece: matrix[rowIndex][colIndex][3],playerId:playerId});
        console.log(selectedPiece);
      }
      // else if (selectedPiece && matrix[rowIndex][colIndex] === "") {
      //   // Move the selected piece
      //   socket.emit("move_piece", {
      //     selectedPiece:selectedPiece,
      //     rule:
      //   });
      //   setSelectedPiece(null);
      //   // setTurn()
      // }
    }

  };

  const isValidPlacement = (rowIndex, colIndex) => {
    if (playerId === 'A' && rowIndex === 4) return true;
    if (playerId === 'B' && rowIndex === 0) return true;
    return false;
  };

  return (
    <div style={styles.container}>
      <div style={styles.gridContainer}>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <div key={colIndex} style={styles.cell} onClick={() => handleCellClick(rowIndex, colIndex)}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={styles.turnDisplay}>
        {placingPhase ? `Place your pieces (${playerId})` : `Current Turn: Player ${turn}`}
      </div>
      <div>
      <PieceRules selectedPiece= {selectedPiece} /> {/* Render the PieceRules component */}
    </div>
    </div>
  );
};

export default MatrixDisplay;
