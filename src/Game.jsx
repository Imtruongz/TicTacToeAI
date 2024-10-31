import React, { useState, useEffect } from "react";
import Board from "./Board";

function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const winner = calculateWinner(squares);
    setWinner(winner);
    if (!winner && squares.every((square) => square !== null)) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
    }
    if (!winner && xIsNext === false) {
      doAIMove();
    }
  }, [squares, xIsNext]);

  function handleSquareClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const updatedSquares = squares.slice();
    updatedSquares[i] = xIsNext ? "X" : "O";
    setSquares(updatedSquares);
    setXIsNext(!xIsNext);
  }

  function doAIMove() {
    const bestMove = findBestMove(squares);
    setTimeout(() => handleSquareClick(bestMove), 1000);
  }

  function findBestMove(squares) {
    let bestValue = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        let moveValue = minimax(squares, 0, false);
        squares[i] = null;

        if (moveValue > bestValue) {
          bestMove = i;
          bestValue = moveValue;
        }
      }
    }
    return bestMove;
  }

  function minimax(squares, depth, isMaximizing) {
    const winner = calculateWinner(squares);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (squares.every((square) => square !== null)) return 0;

    if (isMaximizing) {
      let bestValue = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = "O";
          bestValue = Math.max(bestValue, minimax(squares, depth + 1, false));
          squares[i] = null;
        }
      }
      return bestValue;
    } else {
      let bestValue = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = "X";
          bestValue = Math.min(bestValue, minimax(squares, depth + 1, true));
          squares[i] = null; 
        }
      }
      return bestValue;
    }
  }

  return (
    <div>
      <Board squares={squares} onClick={handleSquareClick} />
      {winner && <p>Winner: {winner}</p>}
      {!winner && isDraw && <p>Draw!</p>}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[b] === squares[a] && squares[c] === squares[a]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
