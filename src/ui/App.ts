import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {UIState} from "./state.js";
import {Wanted} from "./Wanted.js";

export function App(state: UIState) {
    switch (state.world) {
        case "intro":
            return Intro();
        case "wanted":
            return Wanted();
        default:
            return Overlay();
    }
}
