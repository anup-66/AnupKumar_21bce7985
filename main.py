
from flask import Flask, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Game state
matrix = [["" for _ in range(5)] for _ in range(5)]
players = {}
characters = {}
turn = None
pieces_placed = 0
history = []
@app.route('/')
def index():
    return "Server is running"

@socketio.on('join_game')
def on_join_game(data):
    global turn
    name = data['name']
    player_id = 'A' if len(players) == 0 else 'B'
    players[player_id] = name

    if turn is None:
        turn = player_id  # Set the first player to start

    emit('init', {'matrix': matrix, 'turn': turn, 'playerId': player_id, 'playerPieces': get_player_pieces(player_id)})

def get_player_pieces(player_id):
    if player_id == 'A':
        return ['AS1', 'AS2', 'AH1', 'AH2', 'AP']
    else:
        return ['BS1', 'BS2', 'BH1', 'BH2', 'BP']

@socketio.on('place_characters')
def on_place_characters(data):
    global pieces_placed
    player_id = data['playerId']
    character_positions = data['positions']  # List of tuples [(row, col, type), ...]

    # Place characters on the board
    for (row, col, char_type) in character_positions:
        if matrix[row][col] == "":
            matrix[row][col] = f"{player_id}-{char_type}"
            characters[(row, col)] = (player_id, char_type)

    pieces_placed += 1

    # If both players have placed their pieces, start the game
    if pieces_placed == 10:
        emit('start_game', {'matrix': matrix, 'turn': turn}, broadcast=True)
    else:
        emit('update', {'matrix': matrix, 'turn': turn},broadcast=True)

@socketio.on('move_piece')
def on_move_piece(data):
    global turn
    selected_piece = data['piece']
    rule = data['rule']
    row, col = selected_piece['row'], selected_piece['col']
    player_id = selected_piece['playerId']
    piece_type = selected_piece['piece']
    print(selected_piece,rule)
    # Determine new position based on the rule
    new_row, new_col = move(row,col,player_id,piece_type,rule)
    print(new_row,new_col)

    if turn == player_id:
        turn = 'B' if turn == 'A' else 'A'
    # Check if the new position is valid and empty
    if is_valid_move(player_id, row, col, new_row, new_col):
        # Move the piece in the matrix
        temp = matrix[row][col]
        kill(piece_type, player_id, row, col, rule,new_row,new_col)
        matrix[row][col] = ""
        matrix[new_row][new_col] = f"{temp}"
        print(turn,"yes")
        history.append(f"{player_id + {"-"} + piece_type} + {rule}")
        if not check_for_win(player_id):
            # Broadcast the updated matrix and turn
            emit('update', {'matrix': matrix, 'turn': turn}, broadcast=True)
    else:
        emit('invalid_move', {'message': f'Invalid move BY {player_id}'},broadcast=True)

    # Switch turns if applicable
def move(row,col,player_id,player_type,rule):
    if player_id=="A":
        # col = len(matrix[0])-col
        # row = len(matrix) - row
        if player_type=="H":
            new_row = row
            new_col = col
            if rule=="L":
                new_col = col-2
            if rule=="R":
                new_col = col+2
            if rule=="F":
                new_row = row-2
            if rule=="B":
                new_row = row+2

            return new_row,new_col
        if player_type=="P":
            new_row = row
            new_col = col
            if rule == "L":
                new_col = col - 1
            if rule == "R":
                new_col = col + 1
            if rule == "F":
                new_row = row - 1
            if rule == "B":
                new_row = row + 1
            return new_row, new_col
        if player_type=="S":
            new_row = row
            new_col = col
            if rule == "FL":
                new_row = row-1
                new_col = col - 1
            if rule == "FR":
                new_row = row-1
                new_col = col + 1
            if rule == "BL":
                new_col = col-1
                new_row = row - 1
            if rule == "BR":
                new_col = col+1
                new_row = row + 1
            return new_row, new_col
    if player_id=="B":
        if player_type=="H":
            new_row = row
            new_col = col
            if rule=="L":
                new_col = col-2
            if rule=="R":
                new_col = col+2
            if rule=="B":
                new_row = row-2
            if rule=="F":
                new_row = row+2
            return new_row,new_col
        if player_type=="P":
            new_row = row
            new_col = col
            if rule == "L":
                new_col = col - 1
            if rule == "R":
                new_col = col + 1
            if rule == "B":
                new_row = row - 1
            if rule == "F":
                new_row = row + 1
            return new_row, new_col
        if player_type=="S":
            new_row = row
            new_col = col
            if rule == "BL":
                new_row = row - 1
                new_col = col - 1
            if rule == "BR":
                new_row = row - 1
                new_col = col + 1
            if rule == "FL":
                new_col = col - 1
                new_row = row + 1
            if rule == "FR":
                new_col = col + 1
                new_row = row + 1
            return new_row, new_col

def is_valid_move(player_id, old_row, old_col, new_row, new_col):
    opponent = "A" if player_id=="B" else "B"
    # Validate the move
    print("yes",new_row,new_col)
    if new_row<len(matrix) and new_col<len(matrix[0]):
        print(matrix[old_row][old_col],matrix[new_row][new_col])
        if matrix[old_row][old_col].startswith(player_id) and (matrix[new_row][new_col] == "" or matrix[new_row][new_col].startswith(opponent)):
            return True
    return False
# def rules(type,)
def move_character(old_row, old_col, new_row, new_col):
    # Move the character from old position to new position
    matrix[new_row][new_col] = matrix[old_row][old_col]
    matrix[old_row][old_col] = ""

def check_for_win(player_id):
    # Add logic to check if the opposing player has no characters left
    count_b = 0
    count_a = 0
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if "A" in matrix[i][j]:
                count_a+=1
            else:
                count_b+=1
    if count_b==0 or count_a==0:
        emit("game_over")
        return True

    return False
def kill(piece_type,player_type,row,col,rule,new_row,new_col):
    if player_type=="A":
        if piece_type=="H" or player_type=="P":
            if rule=="L":
                for i in range(col,new_col,-1):
                    matrix[row][i] = ""
            if rule == "R":
                for i in range(col, new_col):
                    matrix[row][i] = ""
            if rule == "F":
                for i in range(row, new_row, -1):
                    matrix[i][col] = ""
            if rule == "B":
                for i in range(row, new_row):
                    matrix[i][col] = ""
        if piece_type=="S":
            if rule=="FL":
                for i in range(row,new_row,-1):
                    matrix[row][i] = ""
                for j in range(col,new_col,-1):
                    matrix[new_row][j]=""
            if rule == "FR":
                for i in range(row, new_row, -1):
                    matrix[row][i] = ""
                for j in range(col, new_col, 1):
                    matrix[new_row][j] = ""
            if rule == "BL":
                for i in range(row, new_row, 1):
                    matrix[row][i] = ""
                for j in range(col, new_col, -1):
                    matrix[new_row][j] = ""
            if rule == "BR":
                for i in range(row, new_row, 1):
                    matrix[row][i] = ""
                for j in range(col, new_col, 1):
                    matrix[new_row][j] = ""
    if player_type=="B":
        if piece_type=="H" or player_type=="P":
            if rule=="L":
                for i in range(col,new_col,-1):
                    matrix[row][i] = ""
            if rule == "R":
                for i in range(col, new_col):
                    matrix[row][i] = ""
            if rule == "F":
                for i in range(row, new_row, 1):
                    matrix[i][col] = ""
            if rule == "B":
                for i in range(row, new_row,-1):
                    matrix[i][col] = ""
        if piece_type=="S":
            if rule=="FL":
                for i in range(row,new_row,1):
                    matrix[row][i] = ""
                for j in range(col,new_col,-1):
                    matrix[new_row][j]=""
            if rule == "FR":
                for i in range(row, new_row, 1):
                    matrix[row][i] = ""
                for j in range(col, new_col, 1):
                    matrix[new_row][j] = ""
            if rule == "BL":
                for i in range(row, new_row, -1):
                    matrix[row][i] = ""
                for j in range(col, new_col, -1):
                    matrix[new_row][j] = ""
            if rule == "BR":
                for i in range(row, new_row, -1):
                    matrix[row][i] = ""
                for j in range(col, new_col, 1):
                    matrix[new_row][j] = ""

if __name__ == '__main__':
    socketio.run(app, debug=True)
