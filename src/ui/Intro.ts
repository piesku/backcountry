import {Action} from "../actions.js";
import {html} from "./html.js";

export function Intro(town_seed: number) {
    return html`
        <div
            style="
                position: absolute;
                left: 50%;
                display: flex;
                height: 100%;
            "
        >
            <div
                style="
                    margin: auto 0;
                    font-size: 15vh;
                "
            >
                BACK<br />COUNTRY
                <hr style="border: solid #D45230 10px;" />
                <button onclick="$(${Action.ChangeWorld}, 'map', ${town_seed});">
                    PLAY
                </button>
            </div>
        </div>
    `;
}
