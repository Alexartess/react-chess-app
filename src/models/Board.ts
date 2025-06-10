
import { Cell } from "./Cell"
import { Colors } from "./Colors"
import { Queen } from "./figures/Queen"
import { Pawn } from "./figures/Pawn"
import { King } from "./figures/King"
import { Bishop } from "./figures/Bishop"
import { Rook } from "./figures/Rook"
import { Knight } from "./figures/Knight"
import { Figure } from "./figures/Figure"


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
}