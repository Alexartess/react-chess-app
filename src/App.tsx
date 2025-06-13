import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BoardComponent from './components/BoardComponent';
import { Board } from './models/Board';
import { Player } from './models/Player';
import { Colors } from './models/Colors';
import LostFigures from './components/LostFigures';
import Timer from './components/Timer';
import { MoveHistory } from './models/MoveHistory';
import MoveHistoryComponent from './components/MoveHistoryComponent';
import StorageService from './services/StorageService';
import { GameState } from './models/GameState';

function App() {

  const [board, setBoard] = useState(new Board())
  const [moveHistory] = useState(new MoveHistory());

  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE))
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK))
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)

  const [hasLoaded, setHasLoaded] = useState(false);

  

  const loadGame = (): boolean => {
    const savedGame = StorageService.loadGame();
    if (savedGame) {
        const newBoard = new Board().deserialize({
            figures: savedGame.board,
            lostBlack: savedGame.lostBlackFigures,
            lostWhite: savedGame.lostWhiteFigures
        });
        setBoard(newBoard);
        moveHistory.deserialize(savedGame.moves);
        setCurrentPlayer(savedGame.currentPlayer);
        return true;
    }
    return false;
};

  useEffect(() => {
   loadGame();
  }, []);
  useEffect(() => {
  const loaded = loadGame();
  setHasLoaded(true);
  if (!loaded) {
    // Only initialize new game if no saved game exists
    restartGame(); 
  }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    
    const serialized = board.serialize();
    const gameState: GameState = {
        board: serialized.board,
        moves: moveHistory.getMoves(),
        currentPlayer: currentPlayer,
        lostBlackFigures: serialized.lostBlack,
        lostWhiteFigures: serialized.lostWhite
    };
    StorageService.saveGame(gameState);
  }, [board, currentPlayer, moveHistory, hasLoaded]); 



  const restartGame = () => {
    const newBoard = new Board();
    newBoard.initCells();
    console.log(newBoard.cells);
    newBoard.addFigures();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
    moveHistory.clear();
    StorageService.clearGame();
  };

  function swapPlayer(){
    setCurrentPlayer(currentPlayer?.color===Colors.WHITE ? blackPlayer : whitePlayer)
  }

  return (
    <div className="app">
     
     <Timer restart={restartGame} currentPlayer={currentPlayer}/>
     <BoardComponent board = {board} setBoard={setBoard} currentPlayer = {currentPlayer} swapPlayer = {swapPlayer} restart={restartGame} moveHistory={moveHistory}/>
     <div>
        <LostFigures title={"Черные фигуры"} figures={board.lostBlackFigures}/>
     </div>
     <div>
        <LostFigures title={"Белые фигуры"} figures={board.lostWhiteFigures}/>
     </div>
     <MoveHistoryComponent history={moveHistory} />

     {//buttons for manual testing save & reload
     /* <div className="game-controls">
        <button onClick={restartGame}>New Game</button>
        <button onClick={() => {
            if (window.confirm('Save current game?')) {
                const gameState: GameState = {
                    board: board.serialize(),
                    moves: moveHistory.getMoves(),
                    currentPlayer: currentPlayer
                };
                StorageService.saveGame(gameState);
            }
        }}>Save Game</button>
        
        <button onClick={() => {
            const savedGame = StorageService.loadGame();
            if (savedGame) {
                const newBoard = new Board();
                newBoard.deserialize(savedGame.board);
                setBoard(newBoard);
                moveHistory.deserialize(savedGame.moves);
                setCurrentPlayer(currentPlayer);
            }
        }}>Load Game</button>
    </div> */}
    </div>
  );
}

export default App;
