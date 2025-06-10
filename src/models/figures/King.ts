import { Figure } from "./Figure";
import { Cell } from "../Cell";
import { Colors } from "../Colors";
import blackLogo from "../../assets/black-king.png"
import whiteLogo from "../../assets/white-king.png"
import { FigureNames } from "./Figure";

export class King extends Figure {
    constructor(color: Colors, cell: Cell){
            super(color, cell);
            this.logo = color===Colors.BLACK ? blackLogo : whiteLogo;
            this.name = FigureNames.KING;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target))  //не можем съесть свои же фигуры
            return false;
        
        //на одну клетку по горизонтали
        if(((target.y === this.cell.y + 1) ||(target.y === this.cell.y - 1))
        && (target.x === this.cell.x)) {
            return true;
        }

        //на одну клетку по вертикали
        if(((target.x === this.cell.x + 1) ||(target.x === this.cell.x - 1))
        && (target.y === this.cell.y)) {
            return true;
        }

        //на одну клетку по диагонали
        if(((target.y === this.cell.y + 1) ||(target.y === this.cell.y - 1))
        && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)) {
            return true;
        }
        return false;
    }
}