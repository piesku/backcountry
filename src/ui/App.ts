import {GameState} from "../actions.js";
import {html} from "./html.js";
import {Intro} from "./Intro.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    return html`
        ${state.WorldName === "intro" && Intro(state.SeedPlayer)}
        ${state.WorldName === "wanted" && Wanted(state.SeedHouse)}
    `;
}
