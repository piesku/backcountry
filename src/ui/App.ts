import {GameState} from "../actions.js";
import {html} from "./html.js";
import {Intro} from "./Intro.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    return html`
        ${state.world_name === "intro" && Intro(state.seed_town)}
        ${state.world_name === "wanted" && Wanted(state.seed_house)}
    `;
}
