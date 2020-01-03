import {GameState, PlayerState} from "../actions.js";
import {world_store} from "../worlds/wor_store.js";
import {world_intro} from "../worlds/wor_town.js";
import {world_wanted} from "../worlds/wor_wanted.js";
import {Defeat} from "./Defeat.js";
import {Intro} from "./Intro.js";
import {Playing} from "./Playing.js";
import {Store} from "./Store.js";
import {Victory} from "./Victory.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    if (state.WorldFunc == world_intro) {
        return Intro();
    }
    if (state.WorldFunc == world_store) {
        return Store(state);
    }
    if (state.WorldFunc == world_wanted) {
        return Wanted(state);
    }
    if (state.PlayerState == PlayerState.Victory) {
        return Victory();
    }
    if (state.PlayerState == PlayerState.Defeat) {
        return Defeat(state);
    }
    return Playing(state);
}
