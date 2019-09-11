import {Action} from "../actions.js";

export function Store() {
    return `
        <div style="
            top: 10%;
            height: 25%;
            text-align: center;
            font-size: 15vmin;
        ">
            GENERAL STORE
        </div>
        <div style="
            bottom: 10%;
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
