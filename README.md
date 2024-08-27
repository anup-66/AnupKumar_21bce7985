![image](https://github.com/user-attachments/assets/999a4c38-e595-4b74-be86-c12542059eda)

# Two-Player Board Game with Flask, React, and Socket.IO

This project is a real-time, two-player board game built using Flask for the backend, React for the frontend, and Socket.IO for real-time communication. The game allows players to join from different locations, place their pieces on a grid, and move them according to specified rules.

## Features

- **Real-Time Gameplay**: Both players can see each other's moves in real-time.
- **Piece Placement**: Each player places five unique pieces on the board at the start of the game.
- **Turn-Based Movement**: Players take turns moving their pieces according to specific rules.
- **Move History**: A detailed history of moves and placements is displayed to both players.
- **WebSocket Integration**: Real-time updates are handled through WebSocket connections using Socket.IO.

## Installation

### Prerequisites

- Python 3.8+
- Node.js and npm (for frontend)
- Flask
- Flask-SocketIO
- React
- Socket.IO

### Backend Setup

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/board-game-project.git
    cd board-game-project
    ```

2. **Set up a virtual environment:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Flask server:**

    ```bash
    flask run
    ```

### Frontend Setup

1. **Navigate to the `client` directory:**

    ```bash
    cd client
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start the React development server:**

    ```bash
    npm start
    ```

### Running the Game

- Ensure that both the Flask server and the React development server are running.
- Open your browser and navigate to `http://localhost:3000`.
- Players will be prompted to enter their names and place their pieces on the board.
- The game will begin once both players have placed their pieces.

## How to Play

1. **Joining the Game:**
   - Each player is prompted to enter their name when joining the game.
   - The first player to join will place their pieces in the bottom row, while the second player will place theirs in the top row.

2. **Placing Pieces:**
   - Players are prompted to place their five pieces on their respective rows.
   - The first player can choose from [`AS1`, `AS2`, `Ah1`, `Ah2`, `Ap`].
   - The second player can choose from [`BS1`, `BS2`, `Bh1`, `Bh2`, `Bp`].

3. **Moving Pieces:**
   - Players take turns moving their pieces based on the specified rules (`L`, `R`, `F`, `B`, `FL`, `FR`, `BL`, `BR`).
   - A piece can only be moved according to these rules and the player's current position.

4. **Move History:**
   - A history of all moves and placements is displayed, allowing players to track the progress of the game.

## Project Structure

```plaintext
board-game-project/
├── backend/
│   ├── main.py                # Flask application entry point

├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── styles/           # CSS styles
│   │   ├── App.js            # Main React component
│   │   └── index.js          # React entry point
│   ├── public/               # Public assets
│   └── package.json          # Node.js dependencies
├── README.md                 # Project documentation
└── .gitignore                # Files to ignore in git
Two-Player Board Game with Flask, React, and Socket.IO
This project is a fully interactive, two-player board game designed to demonstrate the power of real-time web applications. The game is built using a combination of Flask, React, and Socket.IO, leveraging their strengths to create a seamless and engaging experience for players.

Objective
The primary objective of this project is to create a turn-based board game where two players can interact with each other in real-time, despite being located in different places. The game incorporates strategic placement and movement of pieces on a grid, requiring players to think critically about their moves.

Technologies Used
Flask: A lightweight Python web framework that handles the backend of the application, including game logic, user session management, and WebSocket communication.

React: A JavaScript library for building user interfaces, particularly single-page applications where data changes over time without needing to reload the entire page.

Socket.IO: A library that enables real-time, bidirectional, and event-based communication between the web clients and server. It is used here to facilitate live updates between players as they make moves in the game.

Game Mechanics
Joining the Game:

The game begins when two players join the same room. Upon joining, each player is prompted to enter their name, which is stored for the duration of the game session.
Piece Placement:

Each player starts by placing five unique pieces on the board. The first player places their pieces in the bottom row, and the second player places theirs in the top row. The pieces are represented by identifiers such as AS1, Ah2, Bp, etc.
Gameplay:

Once both players have placed their pieces, the game begins. Players take turns making moves. Each piece can be moved in various directions (L, R, F, B, FL, FR, BL, BR) according to predefined rules.
Real-Time Interaction:

The moves made by each player are instantly communicated to the other player through WebSocket connections, ensuring a real-time interactive experience.
Move History:

Every move and piece placement is recorded and displayed in a move history log, allowing players to review the game's progress and strategize accordingly.
Challenges and Solutions
Real-Time Synchronization: One of the biggest challenges in creating this game was ensuring that both players' views were consistently synchronized in real-time. This was effectively managed using Socket.IO for real-time event handling and Flask-SocketIO to integrate WebSocket support into the Flask application.

Session Management: Managing player sessions and ensuring that the game state persisted correctly between moves required careful handling of session data in Flask. The solution involved using Flask's session management tools along with custom logic to store and retrieve player information.

User Experience: Creating an intuitive and responsive UI in React that could handle real-time updates without compromising performance was key. React's component-based architecture helped to manage the complexity by breaking down the UI into manageable, reusable components.

Potential Enhancements
AI Opponent: Introducing a single-player mode with an AI opponent could broaden the appeal of the game, allowing users to play even when a second player is not available.

Different Game Modes: Adding different game modes or difficulty levels could provide players with varied challenges and experiences.

Improved UI/UX: Further refining the UI to include animations, better visuals, and sound effects would make the game more engaging.

Persistent Game State: Implementing a persistent game state across sessions would allow players to save their progress and resume the game later.

Conclusion
This project serves as a comprehensive example of how to build a real-time, interactive web application using modern web technologies. It combines the simplicity of Flask, the dynamic nature of React, and the real-time capabilities of Socket.IO to create a fun and engaging experience for players.

Whether you're looking to learn about real-time web development, improve your skills in full-stack development, or just want to play a simple yet strategic board game, this project provides a strong foundation to build upon and expand.

