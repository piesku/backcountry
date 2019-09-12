import {Action} from "../actions.js";

export function Store() {
    return `
        <div style="
            width: 66%;
            margin: 5% auto;
            text-align: center;
            color: #222;
        ">
            GENERAL STORE
        </div>

        <div onclick="$(${Action.ChangePlayerSeed});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            left: 10%;
        ">
            Change Outfit
        </div>

        <div onclick="$(${Action.GoToTown});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            right: 10%;
        ">
            Exit to Town
        </div>
    `;
}
