import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Patterns } from '../WinningPatters';

function Board({ setIsAuth, setUser, user }) {
  const socket = io(process.env.REACT_APP_LOCAL_URL);

  const [game, setGame] = useState({
    board: Array(9).fill(null),
    currentPlayer: 'X',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [playerTurn, setPlayerTurn] = useState('Player A');

  useEffect(() => {
    socket.on('moveMade', (data) => {
      setGame(data.updatedGame);
      setPlayerTurn(data.updatedGame.currentPlayer);
      setErrorMessage('');
    });

    socket.on('gameReset', (newGame) => {
      setGame(newGame);
      setPlayerTurn('Player A');
      setErrorMessage('');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
    });

    socket.on('logged_out', (user) => {
      console.error(user + ' has logged out!');
      setUser('');
      setIsAuth(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('moveMade');
      socket.off('gameReset');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  });

  const calculateWinner = (squares) => {
    for (let i = 0; i < Patterns.length; i++) {
      const [a, b, c] = Patterns[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const makeMove = (index) => {
    const squares = [...game.board];

    if (calculateWinner(squares) || squares[index]) {
      setErrorMessage('Invalid move. Please try again.');
      return;
    }

    squares[index] = game.currentPlayer;

    const updatedGame = {
      ...game,
      board: squares,
      currentPlayer: game.currentPlayer === 'X' ? 'O' : 'X',
    };

    socket.emit('makeMove', { index, updatedGame });
  };

  const resetGame = () => {
    const newGame = {
      board: Array(9).fill(null),
      currentPlayer: 'X',
    };

    socket.emit('resetGame', newGame);
  };

  const logout = () => {
    socket.emit('logging_out', user);
  };

  const winner = calculateWinner(game.board);
  return (
    <div className="app-container">
      <h1>Welcome to Tic Tac Toe Game</h1>
      <div>
        <div className="board">
          {game.board.map((cell, index) => (
            <div
              key={index}
              className={`cell ${winner && winner === cell ? 'winner' : ''}`}
              onClick={() => makeMove(index)}
            >
              {cell}
            </div>
          ))}
        </div>
        <p className="current-player">
          {winner ? `Player ${winner} wins!` : `Current Player: ${playerTurn}`}
        </p>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
        <button className="reset-button" onClick={logout}>
          Logout
        </button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}
export default Board;
