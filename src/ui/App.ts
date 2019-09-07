import {GameState} from "../actions.js";
import {world_intro} from "../worlds/wor_intro.js";
import {world_wanted} from "../worlds/wor_wanted.js";
import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    switch (state.WorldFunc) {
        case world_intro:
            return Intro();
        case world_wanted:
            return Wanted();
        default:
            return Overlay(state);
    }
}
