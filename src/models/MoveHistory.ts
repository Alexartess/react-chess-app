import { Colors } from "./Colors";
import { FigureNames } from "./figures/Figure";

export type Move = {
    player: Colors;
    figure: FigureNames;
    from: string;
    to: string;
    timestamp: Date;
}

export class MoveHistory {
    private moves: Move[] = [];

    addMove(player: Colors, figure: FigureNames, from: string, to: string) {
        this.moves.push({
            player,
            figure,
            from,
            to,
            timestamp: new Date()
        });
    }

    getMoves(): Move[] {
        return [...this.moves];
    }

    clear() {
        this.moves = [];
    }


    serialize(): Move[] {
        return this.moves;
    }

    deserialize(moves: Move[]) {
        this.moves = moves;
    }
}