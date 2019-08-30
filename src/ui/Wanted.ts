import {Action} from "../actions.js";
import {html} from "./html.js";

export function Wanted(house_seed: number) {
    return html`
        <div
            style="
                position: absolute;
                top: 10%;
                height: 25%;
                width: 100%;
                color: #222;
                text-align: center;
                font: 15vh Impact;
            "
        >
            WANTED
        </div>
        <div
            style="
                position: absolute;
                bottom: 10%;
                height: 25%;
                width: 100%;
                color: #222;
                text-align: center;
                font: 10vh Impact;
            "
        >
            <button
                onclick="game.dispatch(${Action.ChangeWorld}, 'house', ${house_seed});"
                style="color: #FFE8C6;"
            >
                ACCEPT BOUNTY
            </button>
        </div>
    `;
}
