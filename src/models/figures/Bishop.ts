import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import { Cell } from "../Cell";
import blackLogo from "../../assets/black-bishop.png"
import whiteLogo from "../../assets/white-bishop.png"

export class Bishop extends Figure {
    constructor(color: Colors, cell: Cell){
        super(color, cell);
        this.logo = color===Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.BISHOP;
    }

    canMove(target: Cell): boolean {
        if(!super.canMove(target))  //не можем съесть свои же фигуры
            return false;
        if(this.cell.isEmptyDiagonal(target))
            return true;
        return false;
    }
}