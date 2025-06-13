import { Figure, FigureNames } from "./Figure";
import { Cell } from "../Cell";
import { Colors } from "../Colors";
import blackLogo from "../../assets/black-pawn.png"
import whiteLogo from "../../assets/white-pawn.png"

export class Pawn extends Figure {

    isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell){
        super(color, cell);
        this.logo = color===Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.PAWN;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target))  //не можем съесть свои же фигуры
            return false;

        //направление движения - черные вниз, белые вверх
        const direction = this.cell.figure?.color===Colors.BLACK ? 1 : -1;
        const firstStepDirection = this.cell.figure?.color===Colors.BLACK ? 2 : -2; //первый ход пешки на 2 клетки
        
        //движение
        //проверяем первый ли это шаг, допускаем движение только по одной полосе по х, проверяем что ячейка пустая
        if ((target.y === this.cell.y + direction || this.isFirstStep
        && (target.y === this.cell.y + firstStepDirection))
        && target.x === this.cell.x
        && this.cell.board.getCell(target.x, target.y).isEmpty()) {
            return true; 
        }

        //атака по диагонали
        //проверяем что двигаемся на 1 ячейку вверх/вниз, что смещаемся по диагонали на 1 ячейку по х, что в ячейке есть враг
        if(target.y === this.cell.y + direction
        && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
        && this.cell.isEnemy(target)) {
            return true;
        }

        return false;
    }

    moveFigure(target: Cell): void {
        super.moveFigure(target);
        this.isFirstStep=false; 
    }

    
}