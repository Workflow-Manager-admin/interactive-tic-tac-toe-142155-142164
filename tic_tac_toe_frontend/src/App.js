import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Color variables as per requirements (primary: #1976d2, secondary: #424242, accent: #fbc02d)
 * These are injected into the CSS root for easy runtime usage.
 */
const COLORS = {
  accent: "#fbc02d",
  primary: "#1976d2",
  secondary: "#424242",
};

function injectAppThemeColors() {
  const style = document.documentElement.style;
  style.setProperty("--primary", COLORS.primary);
  style.setProperty("--secondary", COLORS.secondary);
  style.setProperty("--accent", COLORS.accent);
}
injectAppThemeColors();

/**
 * Returns 'X' or 'O' based on the current player index (0 or 1)
 * @param {number} idx
 * @returns {string}
 */
function getPlayerSymbol(idx) {
  return idx === 0 ? "X" : "O";
}

/**
 * Checks for a winner in the current board state.
 * Returns:
 *   - 'X' if X wins
 *   - 'O' if O wins
 *   - null if no winner yet
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6],            // Diagonals
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Checks for tie: i.e., board is full and no winner
 */
function isTie(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  /** A single Tic Tac Toe square */
  return (
    <button
      className="ttt-square"
      style={{
        color:
          value === "X"
            ? "var(--primary)"
            : value === "O"
            ? "var(--secondary)"
            : "var(--secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function TicTacToeBoard({ squares, onSquareClick, disabled }) {
  /** Displays the 3x3 board with squares */
  return (
    <div className="ttt-board">
      {squares.map((val, i) => (
        <Square
          key={i}
          value={val}
          onClick={() => onSquareClick(i)}
          disabled={Boolean(val) || disabled}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main game state:
   *  - squares: Array(9), value = "X", "O", or null
   *  - xIsNext: boolean, true if 'X' to move, false if 'O'
   *  - gameOver: boolean, disables further moves on win/tie
   *  - winner: "X", "O", or null
   *  - statusText: string, current message
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [statusText, setStatusText] = useState("X to play");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Update win or tie state effects
    const w = calculateWinner(squares);
    if (w) {
      setWinner(w);
      setStatusText(`Winner: ${w}`);
      setGameOver(true);
    } else if (isTie(squares)) {
      setWinner(null);
      setStatusText("It's a tie!");
      setGameOver(true);
    } else {
      setStatusText(`${xIsNext ? "X" : "O"} to play`);
      setWinner(null);
      setGameOver(false);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (squares[idx] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameOver(false);
    setStatusText("X to play");
  }

  // PUBLIC_INTERFACE
  function handleNewGame() {
    handleRestart();
  }

  // UI layout: centered column, minimal styling, controls above board, state below
  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-controls">
          <button
            className="ttt-btn ttt-btn-primary"
            onClick={handleNewGame}
            aria-label="Start new game"
          >
            Start New Game
          </button>
        </div>
        <TicTacToeBoard
          squares={squares}
          onSquareClick={handleSquareClick}
          disabled={gameOver}
        />
        <div className="ttt-status" aria-live="polite">
          <span>{statusText}</span>
        </div>
        {gameOver && (
          <button
            className="ttt-btn ttt-btn-accent"
            onClick={handleRestart}
            aria-label="Restart game"
            style={{ marginTop: "1.2rem" }}
          >
            Restart Game
          </button>
        )}
      </main>
      {/* Attribution footer, if desired */}
    </div>
  );
}

export default App;
