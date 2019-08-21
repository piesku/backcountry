import {Action} from "../actions.js";
import {html} from "./html.js";

export function Overlay() {
    return html`
        <button onclick="game.dispatch(${Action.ChangeWorld}, 'intro')" style="color: #fff">
            Back
        </button>
    `;
}
