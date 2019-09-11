import {Action} from "../actions.js";

export function Store() {
    return `
        <div style="
            position: absolute;
            top: 10%;
            height: 25%;
            width: 100%;
            text-align: center;
            font-size: 15vmin;
        ">
            GENERAL STORE
        </div>
        <div style="
            position: absolute;
            bottom: 10%;
            width: 100%;
            text-align: center;
            font-size: 10vmin;
        ">
            <div onclick="$(${Action.ChangePlayerSeed});">
                CHANGE OUTFIT
            </div>
            <br>
            <div onclick="$(${Action.GoToTown});">
                EXIT TO TOWN
            </div>
        </div>
    `;
}
