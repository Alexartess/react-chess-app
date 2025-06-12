import { GameState } from "../models/GameState";


const GAME_STATE_KEY = 'chess_game_state';

class StorageService {
    static saveGame(state: GameState) {
         console.log("saveGame is called:", state);
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    }

    static loadGame(): GameState | null {
        const data = localStorage.getItem(GAME_STATE_KEY);
        console.log("loadGame is called:", data);
        return data ? JSON.parse(data) : null;
    }

    static clearGame() {
        localStorage.removeItem(GAME_STATE_KEY);
    }
}

export default StorageService;