import {GameState} from "../actions.js";
import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    switch (state.world) {
        case "intro":
            return Intro();
        case "wanted":
            return Wanted();
        default:
            return Overlay();
    }
}
