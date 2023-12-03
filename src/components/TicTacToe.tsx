import React, { useState, useEffect } from 'react';
import '../styles/index.css';

const TicTacToeGame = () => {
    const [gameStage, setGameStage] = useState('preGame');
    const [nickName, setNickName] = useState('');
    const [consecutiveWins, setConsecutiveWins] = useState(0);
    const initialBoard = Array(9).fill(null);
    const [board, setBoard] = useState(initialBoard);
    const [isPlayerNext, setIsPlayerNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [showTie, setShowTie] = useState(false);

    useEffect(() => {
        // Check if it's AI's turn and the game is still ongoing
        if (!isPlayerNext && !winner) {
            makeAIMove();
        }
    }, [isPlayerNext, winner]);

    
    

    const handleClick = (index: number) => {
        if (winner || board[index]) return;
        makeMove(index, 'X');
    };

    const resetBoard = () => {
        setBoard(initialBoard);
        setIsPlayerNext(true);
        setWinner(null);
    };


    const makeMove = (index: number | null, player: string) => {
        if (index !== null) {
            const updatedBoard = [...board];
            updatedBoard[index] = player;
            setBoard(updatedBoard);
            checkWinner(updatedBoard);

            // Switch turn
            setIsPlayerNext(player === 'O');
        }
    };

    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    const checkWinner = (board: any[]) => {
        let foundWinner = null;
        

        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                foundWinner = board[a];
                break;
            }
        }

        if (foundWinner) {
            setWinner(foundWinner)
            if (foundWinner === 'X') { //player wins
                setConsecutiveWins(consecutiveWins + 1);
                setTimeout(resetBoard, 2000) //reset board after 2 seconds
            } else if (foundWinner === 'O') { //AI wins
                setTimeout(() => setGameStage('postGame'), 2000) //go to postgame after 2 seconds
            }
        } else if (!board.includes(null)) { //tie condition
            setShowTie(true);
            setTimeout(() => {
                setShowTie(false);
                resetBoard();
            }, 2000) //reset board after 2 seconds
        }
    };

    const makeAIMove = () => {
        let move = findWinningMove('O') || findWinningMove('X') || playCenter() || findRandomMove();
        makeMove(move, 'O');
    };

    const findWinningMove = (player: string) => {
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] === player && board[a] === board[b] && !board[c]) {
                return c;
            }
            if (board[a] === player && board[a] === board[c] && !board[b]) {
                return b;
            }
            if (board[b] === player && board[b] === board[c] && !board[a]) {
                return a;
            }
        }
        return null;
    };

    const findRandomMove = () => {
        let availablePositions = board.map((item: null, idx: any) => item === null ? idx : null).filter((item: null) => item !== null);
        return availablePositions.length > 0
            ? availablePositions[Math.floor(Math.random() * availablePositions.length)]
            : null;
    };

    const playCenter = () => {
        return board[4] === null ? 4 : null;
    }


    const renderCell = (_index: any) => {
        return (
            <button className='cell' onClick={() => handleClick(_index)}>
                {board[_index]}
            </button>
        );
    };

    const startGame = () => {
        setGameStage('nickName');
    };

    const handleNickNameSubmit = () => {
        if (nickName === '') {
            alert('Please enter a name to start the game');
        }
        setGameStage('inGame');
    }

    const renderPreGame = () => (
        <div className='promptBox'>
            <p>Do you want to play a game?</p>
            <button className='button' onClick={startGame}>Yes</button>
            <button className='button' onClick={startGame}>Of course</button>
        </div>
    );
    
    
    
    const renderNickNameInput = () => (
        <div className="nicknameInput">
            <h1>Enter your player name:</h1>
            <input
                 type="text" 
                 placeholder='Type your name here'
                 value={nickName} 
                 onChange={(e: { target: { value: any; }; }) => setNickName(e.target.value)} 
            />
            <button 
                className='button' 
                onClick={handleNickNameSubmit}
                disabled={!nickName.trim()}
                >
                    Start Game</button>
        </div>
    );
    
    

    const renderGame = () => (
        <div className="ticTacToeGame">
            <div className="board">
                {Array(9).fill(null).map((_, index) => renderCell(index))}
                {showTie && <p>Tie!</p>}
            </div>
            <p>Consecutive wins</p>{consecutiveWins}
        </div>
    );

    const renderPostGame = () => (
        <div className="postGame">
            <p>Game Over! Your consecutive wins: {consecutiveWins}</p>
            {/*highscore display coming later */}
        </div>
    );

    return (
        <div>
            {gameStage === 'preGame' && renderPreGame()}
            {gameStage === 'nickName' && renderNickNameInput()}
            {gameStage === 'inGame' && renderGame()}
            {gameStage === 'postGame' && renderPostGame()}
        </div>
    )
};

export default TicTacToeGame;