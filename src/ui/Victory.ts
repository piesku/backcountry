import {Action} from "../actions.js";
import {html} from "./html.js";

export function Victory() {
    return html`
        <div
            style="
                position: absolute;
                top: 10%;
                height: 25%;
                width: 100%;
                text-align: center;
                font-size: 15vh;
            "
        >
            VICTORY
        </div>
        <div
            style="
                position: absolute;
                bottom: 13%;
                width: 100%;
                text-align: center;
                font-size: 10vh;
            "
        >
            <button onclick="$(${Action.ChangeWorld}, 'intro');">
                COLLECT BOUNTY
            </button>
        </div>
    `;
}