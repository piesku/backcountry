import {Action} from "../actions.js";
import {html} from "./html.js";

export function Intro() {
    return html`
        <button onclick="game.dispatch(${Action.ChangeWorld}, 'stage')">
            Play
        </button>
    `;
}
