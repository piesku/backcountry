import {Action} from "../actions.js";
import {html} from "./html.js";

export function Overlay() {
    return html`
        ${["intro", "map", "mine", "wanted"].map(
            name =>
                html`
                    <button
                        onclick="game.dispatch(${Action.ChangeWorld}, '${name}')"
                        style="color: #fff"
                    >
                        ${name}
                    </button>
                `
        )}
    `;
}
