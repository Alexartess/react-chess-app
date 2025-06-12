import React, { useEffect, useState } from "react";
import { Board } from "../models/Board";
import { FC } from "react";
import CellComponent from "./CellComponent";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import { MoveHistory } from "../models/MoveHistory";

interface BoardProps{
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => void;
    restart: () => void;
    moveHistory: MoveHistory;
}


const BoardComponent: FC<BoardProps> =({board, setBoard, currentPlayer, swapPlayer, restart, moveHistory}) =>{
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null) //указываем какой тип будет в этом состоянии (cell или null)
    const [gameOver, setGameOver] = useState<{winner: Colors | null}>({winner: null});

    const handleRestart = () => {
        setGameOver({winner: null});
        restart(); 
        setSelectedCell(null);
    }

    function click(cell: Cell){
        if (gameOver.winner) return; //возврат из функции если игра уже закончена

        if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {

            if (selectedCell.figure) {
                const from = `${String.fromCharCode(97 + selectedCell.x)}${8 - selectedCell.y}`;
                const to = `${String.fromCharCode(97 + cell.x)}${8 - cell.y}`;
                moveHistory.addMove(
                    currentPlayer?.color || Colors.WHITE,
                    selectedCell.figure.name,
                    from,
                    to
                );
            }

            const kingCaptured = selectedCell.moveFigure(cell);
        
            if (kingCaptured) {
                setGameOver({winner: currentPlayer?.color || null});
            } 
            else {
                const opponentColor = currentPlayer?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
                if (board.isCheckmate(opponentColor)) {
                    setGameOver({winner: currentPlayer?.color || null});
                } else {
                    swapPlayer();
                }
            }
            
            setSelectedCell(null);
        } else {
            if (cell.figure?.color === currentPlayer?.color) {
                setSelectedCell(cell);
            }
        }
       
    }   

    //на любое изменение выбранной ячейки вызываем highlight
    // useEffect(() =>{
    //     highlightCells()
    // }, [selectedCell])

      useEffect(() => {
        highlightCells();
        highlightKingUnderAttack();
    }, [selectedCell, currentPlayer]);


    function highlightCells(){  //подсветка ячеек 
        board.highlightCells(selectedCell)
        updateBoard()

    }

    function highlightKingUnderAttack() {
        console.log("highlight king under attack is called")
        // Reset all attack highlights
        board.cells.forEach(row => row.forEach(cell => cell.underAttack = false));
        
        // Highlight if king is under attack
        const currentOpponentColor = currentPlayer?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
        if (board.isKingUnderAttack(currentOpponentColor)) {
            const kingCell = board.findKingCell(currentOpponentColor);
            if (kingCell) kingCell.underAttack = true;
        }
        
        updateBoard();
    }

    //функция для перерендеринга компонента
    function updateBoard(){
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    return(
        <div>
            <h3>Текущий ход: {currentPlayer?.color===Colors.BLACK? "Черные" : "Белые"}</h3>
            
            {gameOver.winner && (
            <div className="game-over">
                <div className="game-over-content">
                        <h2>Игра окончена!</h2>
                        <p>Победитель: {gameOver.winner === Colors.BLACK ? "Черные" : "Белые"}</p>
                        <button onClick={handleRestart}>Начать заново</button> 
                </div>
                
            </div>
            )}

            <div className="board">
            
            {board.cells.map((row, index) =>
                <React.Fragment key={index}>
                    {row.map(cell =>
                        <CellComponent cell={cell} 
                            key={cell.id} 
                            selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                            click={click}/>
                    )}
                </React.Fragment>
            )}
            </div>
        </div>
    );
};

export default BoardComponent;