import {GameState} from "../actions.js";
import {html} from "./html.js";
import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {Victory} from "./Victory.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    return html`
        ${Overlay(state)} ${state.WorldName === "intro" && Intro(state.SeedPlayer)}
        ${state.WorldName === "wanted" && Wanted(state.SeedHouse)}
        ${state.WorldName === "victory" && Victory()}
    `;
}
