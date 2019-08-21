import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {UIState} from "./state.js";

export function App(state: UIState) {
    switch (state.world) {
        case "intro":
            return Intro();
        case "stage":
            return Overlay();
        default:
            return "";
    }
}
