import React, { useEffect, useState } from "react";
import { Board } from "../models/Board";
import { FC } from "react";
import CellComponent from "./CellComponent";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";

interface BoardProps{
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => void;
}


const BoardComponent: FC<BoardProps> =({board, setBoard, currentPlayer, swapPlayer}) =>{
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null) //указываем какой тип будет в этом состоянии (cell или null)

    function click(cell: Cell){
        if(selectedCell && selectedCell!==cell && selectedCell.figure?.canMove(cell)){
            selectedCell.moveFigure(cell);
            swapPlayer();
            setSelectedCell(null);
        } else{
            if(cell.figure?.color===currentPlayer?.color) //can't select enemy figure
                setSelectedCell(cell)
        }
       
    }   

    //на любое изменение выбранной ячейки вызываем highlight
    useEffect(() =>{
        highlightCells()
    }, [selectedCell])


    function highlightCells(){  //подсветка ячеек 
        board.highlightCells(selectedCell)
        updateBoard()

    }

    //функция для перерендеринга компонента
    function updateBoard(){
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    return(
        <div>
            <h3>Текущий игрок: {currentPlayer?.color===Colors.BLACK? "Черный" : "Белый"}</h3>
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