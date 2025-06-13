import { FC } from 'react';
import { Colors} from '../models/Colors';
import { FigureNames } from '../models/figures/Figure';
import { MoveHistory } from '../models/MoveHistory';

interface MoveHistoryProps {
    history: MoveHistory;
}

const MoveHistoryComponent: FC<MoveHistoryProps> = ({ history }) => {
    const moves = history.getMoves();

    return (
        <div className="move-history">
            <h3>История ходов</h3>
            <div className="moves-list">
                {moves.map((move, index) => (
                    <div key={index} className={`move ${move.player === Colors.WHITE ? 'white' : 'black'}`}>
                        <span className="player">{move.player === Colors.WHITE ? 'Белые' : 'Черные'}: </span>
                        <span className="figure">{move.figure}: </span>
                        <span className="move">{move.from} → {move.to}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoveHistoryComponent;