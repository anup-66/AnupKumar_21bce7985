// import React from 'react';
// import socketConnection from "./Matrix";

// const styles = {
//   rulesContainer: {
//     marginTop: '20px',
//     padding: '10px',
//     backgroundColor: '#333',
//     color: '#FFF',
//     borderRadius: '10px',
//     textAlign: 'center',
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '10px',
//   },
//   ruleButton: {
//     backgroundColor: '#222',
//     color: '#FFF',
//     padding: '10px 20px',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '16px',
//     fontWeight: 'bold',
//   },
// };
//
// const PieceRules = ({ selectedPiece }) => {
//   const rules = getRulesForPiece(selectedPiece);
//
//   if (!rules) return null;
//
//   return (
//     <div style={styles.rulesContainer}>
//       <div>Selected: {selectedPiece.piece}</div>
//       {rules.map((rule, index) => (
//         <div key={index} style={styles.ruleButton}>
//           {rule}
//         </div>
//       ))}
//     </div>
//   );
// };
//
// const getRulesForPiece = (selectedPiece) => {
//   if (!selectedPiece) return null;
//
//   const { piece } = selectedPiece;
//
//   const rules = {
//     'AS1': ['L', 'R', 'F', 'B'],
//     'AS2': ['L', 'R', 'F', 'B'],
//     'Ah1': ['L', 'R'],
//     'Ah2': ['L', 'R'],
//     'Ap': ['F', 'B'],
//     'BS1': ['L', 'R', 'F', 'B'],
//     'BS2': ['L', 'R', 'F', 'B'],
//     'Bh1': ['L', 'R'],
//     'Bh2': ['L', 'R'],
//     'Bp': ['F', 'B'],
//   };
//
//   return rules[piece] || [];
// };
//
// export default PieceRules;
// import React from 'react';
import React from 'react';
// import socketConnection from "./Matrix";
// import io from "socket.io-client";
import io from "socket.io-client"; // Import your socket connection

const styles = {
  rulesContainer: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: '10px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  ruleButton: {
    backgroundColor: '#222',
    color: '#FFF',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

const PieceRules = ({ selectedPiece}) => {
  const socketConnection = io("http://localhost:5000");
  const rules = getRulesForPiece(selectedPiece);

  if (!rules) return null;

  // Function to handle clicking on a rule
  const handleRuleClick = (rule) => {
    if (selectedPiece ) {
      socketConnection.emit('move_piece', {
        piece: selectedPiece,
        rule: rule,
      });
    }
  };

  return (
    <div style={styles.rulesContainer}>
      <div>Selected: {selectedPiece.piece}</div>
      {rules.map((rule, index) => (
        <div
          key={index}
          style={styles.ruleButton}
          onClick={() => handleRuleClick(rule)} // Add click event
        >
          {rule}
        </div>
      ))}
    </div>
  );
};

// Helper function to get the rules for the selected piece
const getRulesForPiece = (selectedPiece) => {
  if (!selectedPiece) return null;

  const { piece } = selectedPiece;

  const rules = {
    'P': ['L', 'R', 'F', 'B'],
    "H":['L','R','F','B'],
    "S":['FL','FR','BL','BR']
  };

  return rules[piece] || [];
};

export default PieceRules;
