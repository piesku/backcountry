import {GameState} from "../actions.js";
import {html} from "./html.js";
import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    return html`
        ${Overlay(state)} ${state.world_name === "intro" && Intro(state.seed_town)}
        ${state.world_name === "wanted" && Wanted(state.seed_house)}
    `;
}
