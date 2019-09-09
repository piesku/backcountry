import {Action} from "../actions.js";

export function Wanted() {
    return `
        <div style="
            position: absolute;
            top: 10%;
            height: 25%;
            width: 100%;
            color: #222;
            text-align: center;
            font-size: 15vh;
        ">
            WANTED
        </div>
        <div style="
            position: absolute;
            bottom: 13%;
            width: 100%;
            text-align: center;
            font-size: 10vh;
        ">
            <button onclick="$(${Action.GoToTown});">
                ACCEPT BOUNTY
            </button>
        </div>
    `;
}
