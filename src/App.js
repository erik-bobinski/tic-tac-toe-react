import { useState } from 'react';

function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({ xIsNext, squares, onPlay }) {

    function handleClick(i) {
        /* prevent overwriting squares if it's been filled
        or the game is over */
        if (squares[i] || calculateWinner(squares)) return;

        // toggle b/w player X and O
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O";
        onPlay(nextSquares);
    }

    // display the winner or whose turn it is
    const winner = calculateWinner(squares);
    let status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

export default function Game() {
    // store all states of the board
    const [history, setHistory] = useState([Array(9).fill(null)]);

    // state of current move
    const [currentMove, setCurrentMove] = useState(0);

    // state of next player -> x is on even moves, O on odd moves
    const xIsNext = currentMove % 2 === 0;

    // store the latest state of the board
    const currentSquares = history[currentMove];

    /* update history of moves and current player,
    this allows you to jump to a prev move and make new moves,
    erasing all that comes after*/
    function handePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    // update current move and the next player
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move === 0) {
            description = "Go to game start";
        }
        else if (move === history.length - 1) {
            description = "You are at move #" + move;
            return (
                <li key={move}>
                    <p>{description}</p>
                </li>
            );
        }
        else {
            description = "Go to move #" + move;
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    // check each possible winning line
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
        if (squares[a] && squares[a] == squares[b] && squares[b] == squares[c] && squares[c]) {
            return squares[a];
        }
    }
    return null;
}
