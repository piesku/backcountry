import {Action} from "../actions.js";

export function Defeat() {
    return `
        <div style="
            position: absolute;
            top: 10%;
            height: 25%;
            width: 100%;
            text-align: center;
            font-size: 15vh;
        ">
            WASTED
        </div>
        <div style="
            position: absolute;
            bottom: 13%;
            width: 100%;
            text-align: center;
            font-size: 10vh;
        ">
            <button onclick="$(${Action.EndChallenge});">
                TRY AGAIN
            </button>
        </div>
    `;
}
