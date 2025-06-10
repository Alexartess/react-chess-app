import { Figure } from "./Figure";
import { Cell } from "../Cell";
import { Colors } from "../Colors";
import blackLogo from "../../assets/black-knight.png"
import whiteLogo from "../../assets/white-knight.png"
import { FigureNames } from "./Figure";

export class Knight extends Figure {
    constructor(color: Colors, cell: Cell){
        super(color, cell);
        this.logo = color===Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KNIGHT;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target))  //не можем съесть свои же фигуры
            return false;
        const dx =  Math.abs(this.cell.x - target.x);
        const dy =  Math.abs(this.cell.y - target.y);
        //конь двигается на 2 клетки по одной оси и на 1 клетку по другой
        return (dx === 1 && dy ===2) || (dy ===1 && dx ===2);
    }
}