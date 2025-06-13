
import { Cell } from "./Cell"
import { Colors } from "./Colors"
import { Queen } from "./figures/Queen"
import { Pawn } from "./figures/Pawn"
import { King } from "./figures/King"
import { Bishop } from "./figures/Bishop"
import { Rook } from "./figures/Rook"
import { Knight } from "./figures/Knight"
import { Figure } from "./figures/Figure"
import { FigureNames } from "./figures/Figure"
import { SerializedFigure, SerializedLostFigure } from "./GameState"


export class Board{
    cells: Cell[][] = []
    lostBlackFigures: Figure[] = []
    lostWhiteFigures: Figure[] = []

    public initCells(){
        for (let i = 0; i<8; i++){
            const row: Cell[]=[]
            for (let j = 0; j<8; j++){
                if((i+j) %2 !==0){
                    row.push(new Cell(this, j,i, Colors.BLACK, null))
                    //console.log("new black cell");
                    //console.log(row);
                } else{
                    row.push(new Cell(this, j,i, Colors.WHITE, null))
                }
            }
            this.cells.push(row);
        }
        
    }

    //просчитываем куда можем ходить внутри модели, без перерисовки интерфейса
    public highlightCells(selectedCell: Cell | null){
        //перебор всех ячеек, чтобы понять, куда можно ходить
        for( let i = 0 ; i< this.cells.length; i++){
            const row = this.cells[i];
            for(let j = 0; j< row.length; j++){
                const target = row[j];

                //проверяем есть ли в ячейке фигура и может ли она ходить;
                /*The !! operator forces the result into a strict boolean:
                If the result is undefined, !!undefined becomes false.
                If the result is true, !!true remains true.
                If the result is false, !!false remains false.
                So the expression is never undefined, compatible with target.available: boolean. */
                target.available= !!selectedCell?.figure?.canMove(target) 
            }
        }
    }

    public getCopyBoard(): Board{
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        return newBoard;
    }

    private addPawns(){
        for (let i =0; i<8; i++) {
           new Pawn(Colors.BLACK, this.getCell(i, 1))
           new Pawn(Colors.WHITE, this.getCell(i, 6))
            
        }
    }

    private addKnights(){
        new Knight(Colors.BLACK, this.getCell(1, 0))
        new Knight(Colors.BLACK, this.getCell(6, 0))
        new Knight(Colors.WHITE, this.getCell(1, 7))
        new Knight(Colors.WHITE, this.getCell(6, 7))
    }

    private addBishops(){
        new Bishop(Colors.BLACK, this.getCell(2, 0))
        new Bishop(Colors.BLACK, this.getCell(5, 0))
        new Bishop(Colors.WHITE, this.getCell(2, 7))
        new Bishop(Colors.WHITE, this.getCell(5, 7))
    }

    private addQueens(){
        new Queen(Colors.BLACK, this.getCell(3, 0))
        new Queen(Colors.WHITE, this.getCell(3, 7))
    }

    private addKings(){
        new King(Colors.BLACK, this.getCell(4, 0))
        new King(Colors.WHITE, this.getCell(4, 7))
    }

    private addRooks(){
        new Rook(Colors.BLACK, this.getCell(0, 0))
        new Rook(Colors.BLACK, this.getCell(7, 0))
        new Rook(Colors.WHITE, this.getCell(0, 7))
        new Rook(Colors.WHITE, this.getCell(7, 7))
    }

    public addFigures(){
        //console.log("adding figures");
      this.addBishops();
      this.addKings();
      this.addKnights();
      this.addPawns();
      this.addQueens();
      this.addRooks();
    }
    public getCell(x: number, y: number){
        return this.cells[y][x];
    }


    findKingCell(color: Colors): Cell | null {
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.figure?.name === FigureNames.KING && cell.figure.color === color) {
                    return cell;
                }
            }
        }
        return null;
    }

    isKingUnderAttack(color: Colors): boolean {
        //находим в какой клетке король
        const kingCell = this.findKingCell(color);
        if (!kingCell) return false;

        //проверяем может ли фигура походить на клетку с королем
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.figure && cell.figure.color !== color && cell.figure.canMove(kingCell)) {
                    return true;
                }
            }
        }
        return false;
    }

    isCheckmate(color: Colors): boolean{
        console.log("isCheckmate method is called")
        if (!this.isKingUnderAttack(color)) return false;

        //check if any move can get the king out of check
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.figure?.color === color) {
                    for (let targetRow of this.cells) {
                        for (let targetCell of targetRow) {
                            if (cell.figure.canMove(targetCell)) {
                                //проверяем ход на модели
                                const originalFigure = targetCell.figure;
                                targetCell.figure = cell.figure;
                                cell.figure = null;
                                
                                const stillInCheck = this.isKingUnderAttack(color);
                                
                                //возвращаем назад
                                cell.figure = targetCell.figure;
                                targetCell.figure = originalFigure;
                                
                                if (!stillInCheck) { //король может спастись
                                    return false; 
                                }
                            }
                        }
                    }
                }
            }
        }
        return true; //король не может спастись
    }


    //serialization for local storage
    // serialize(): SerializedFigure[] {
    //     const figures: SerializedFigure[] = [];
    //     this.cells.forEach(row => {
    //         row.forEach(cell => {
    //             if (cell.figure) {
    //                 figures.push({
    //                     color: cell.figure.color,
    //                     name: cell.figure.name,
    //                     x: cell.x,
    //                     y: cell.y
    //                 });
    //             }
    //         });
    //     });
    //     return figures;
    // }

    // In Board.ts
    serialize(): { board: SerializedFigure[], lostBlack: SerializedLostFigure[], lostWhite: SerializedLostFigure[] } {
        const boardFigures: SerializedFigure[] = [];
        this.cells.forEach(row => {
            row.forEach(cell => {
                if (cell.figure) {
                    boardFigures.push({
                        color: cell.figure.color,
                        name: cell.figure.name,
                        x: cell.x,
                        y: cell.y
                    });
                }
            });
        });

        const lostBlack = this.lostBlackFigures.map(fig => ({
            color: fig.color,
            name: fig.name
        }));

        const lostWhite = this.lostWhiteFigures.map(fig => ({
            color: fig.color,
            name: fig.name
        }));

        return {
            board: boardFigures,
            lostBlack,
            lostWhite
        };
    }



    deserialize(data: { figures: SerializedFigure[], lostBlack: SerializedLostFigure[], lostWhite: SerializedLostFigure[] }): Board {
    const newBoard = this;
    newBoard.initCells();
    console.log(data.figures);
    const cellsWithFigures = data.figures.map(fig => {
        const cell = newBoard.getCell(fig.x, fig.y);
        if (!cell) return null;
        
        let figure: Figure;
        switch(fig.name) {
            // ... same switch cases as before ...
                    case FigureNames.KING:
                        figure = new King(fig.color, cell);
                        break;
                    case FigureNames.QUEEN:
                        figure = new Queen(fig.color, cell);
                        break;
                    case FigureNames.BISHOP:
                        figure = new Bishop(fig.color, cell);
                        break;
                    case FigureNames.KNIGHT:
                        figure = new Knight(fig.color, cell);
                        break;
                    case FigureNames.ROOK:
                        figure = new Rook(fig.color, cell);
                        break;
                    default:
                        figure = new Pawn(fig.color, cell);
        }
        
        return { cell, figure };
    }).filter((item): item is { cell: Cell; figure: Figure } => item !== null) ;
    console.log(cellsWithFigures);
    cellsWithFigures.forEach(({ cell, figure }) => {
        if (cell && figure) {
            cell.setFigure(figure);
        }
    });
   
     // Restore lost figures
    newBoard.lostBlackFigures = data.lostBlack.map(fig => {
        const dummyCell = new Cell(newBoard, 0, 0, Colors.BLACK, null);
        let figure: Figure;
        switch(fig.name) {
            case FigureNames.KING:
                figure = new King(fig.color, dummyCell);
                break;
            case FigureNames.QUEEN:
                figure = new Queen(fig.color, dummyCell);
                break;
            case FigureNames.KNIGHT:
                figure = new Knight(fig.color, dummyCell);
                break;
            case FigureNames.BISHOP:
                figure = new Bishop(fig.color, dummyCell);
                break;
            case FigureNames.ROOK:
                figure = new Rook(fig.color, dummyCell);
                break;
            
            default:
                figure = new Pawn(fig.color, dummyCell);
        }
        return figure;
    });

    newBoard.lostWhiteFigures = data.lostWhite.map(fig => {
        const dummyCell = new Cell(newBoard, 0, 0, Colors.WHITE, null);
        let figure: Figure;
        switch(fig.name) {
           case FigureNames.KING:
                figure = new King(fig.color, dummyCell);
                break;
            case FigureNames.QUEEN:
                figure = new Queen(fig.color, dummyCell);
                break;
            case FigureNames.KNIGHT:
                figure = new Knight(fig.color, dummyCell);
                break;
            case FigureNames.BISHOP:
                figure = new Bishop(fig.color, dummyCell);
                break;
            case FigureNames.ROOK:
                figure = new Rook(fig.color, dummyCell);
                break;
            
            default:
                figure = new Pawn(fig.color, dummyCell);
        }
        return figure;
    });

    return newBoard;
}

}