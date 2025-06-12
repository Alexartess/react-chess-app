import { Colors} from "./Colors";
import { Cell } from "../models/Cell";
import { Figure, FigureNames } from "./figures/Figure";
import { Move, MoveHistory } from "./MoveHistory";
import { Player } from "./Player";

export interface SerializedFigure {
    color: Colors;
    name: FigureNames;
    x: number;
    y: number;
}

export interface GameState {
    board: SerializedFigure[];
    moves: Move[];
    currentPlayer: Player | null;
   
}