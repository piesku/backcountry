import {Action} from "../actions.js";

export function Store() {
    return `
        <div style="
            color: #222;
        ">
            GENERAL STORE
        </div>
        <div></div>
        <div style="
            display: flex;
            justify-content: space-around;
            width: 100%;
        ">
            <div onclick="$(${Action.ChangePlayerSeed});" style="
                font: italic bold small-caps 7vmin serif;
                cursor: pointer;
            ">
                Change Outfit
            </div>
            <div onclick="$(${Action.GoToTown});" style="
                font: italic bold small-caps 7vmin serif;
                cursor: pointer;
            ">
                Exit to Town
            </div>
        </div>
    `;
}
