import { useState } from 'react';

/**
 * Square button composant
 * @param {String} value - The display value ('X', 'O' or null)
 * @param {function} onSquareClick - Callback function for click events
 */
function Square({ value, onSquareClick }) {
	return (
		<button className="square" onClick={onSquareClick}>{value}</button>
	);
}

/**
 * Grid and gameplay logic
 * @param {boolean} xIsNext - The current player
 * @param {Array} squares - Current state of the board
 * @param {function} onPlay - Function to update the history
 */
function Board({ xIsNext, squares, onPlay }) {
	// Check for the current state
	const winner = calculateWinner(squares);
	const isDraw = squares.every(square => square !== null);

	// Status message
	let status;
	if (winner) {
		status = "Winner : " + winner;
	} else if (isDraw) {
		status = "Draw !"
	} else {
		status = "Next player : " + (xIsNext ? "X" : "O");
	}

	// handles square selection
	function handleClick(pos) {
		// If square is alreday played, or game finished
		if (squares[pos] || calculateWinner(squares) || isDraw) {
			return;
		}

		// immutable copy
		const newSquares = squares.slice();
		newSquares[pos] = xIsNext ? "X" : "O";
		onPlay(newSquares);
	}

	return (
		<>
			<div className="status">{status}</div>
			<div className="grid-container">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div>
		</>
	);
};

/**
 * Manages the game state and history.
 */
export default function Game() {
	// Array of game boards
	const [history, setHistory] = useState([Array(9).fill(null)]);

	// Current state of the history the user is currently viewing
	const [currentMove, setCurrentMove] = useState(0);

	// Current player 
	const xIsNext = currentMove % 2 === 0;

	// Current board state
	const currentSquares = history[currentMove];

	// Update the history when a move is played
	function handlePlay(newSquares) {
		const newHistory = [...history.slice(0, currentMove + 1), newSquares];
		setHistory(newHistory);
		setCurrentMove(newHistory.length - 1);
	}

	// Reset the game
	function resetGame() {
		setHistory([Array(9).fill(null)]);
		setCurrentMove(0);
	}

	// Switches the current view
	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	// Creation of the history list
	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			description = "Go to move " + move;
		} else {
			description = "Go to game start";
		}

		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	return (
		<div className="main-container">
			<h1 className="game-title">Tic Tac Toe Game</h1>

			<div className="game">
				<div className="game-board">
					<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
					<button className='reset-button' onClick={resetGame}>Restart game</button>
				</div>
				<div className="game-info">
					<ol>{moves}</ol>
				</div>
			</div>
		</div>
	);
}

/**
 * Function to check for a winner
 * @param {Array} squares - Current state of the board
 * @returns {String|null} - Returns 'X', 'O' or null
 */
function calculateWinner(squares) {
	// All possible winning conditions
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}