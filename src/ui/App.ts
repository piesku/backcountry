import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {UIState} from "./state.js";

export function App(state: UIState) {
    switch (state.world) {
        case "intro":
            return Intro();
        default:
            return Overlay();
    }
}
