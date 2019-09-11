import {Action} from "../actions.js";

export function Victory() {
    return `
        <div style="
            position: absolute;
            top: 10%;
            height: 25%;
            width: 100%;
            text-align: center;
            font-size: 15vmin;
        ">
            VICTORY
        </div>
        <div style="
            position: absolute;
            bottom: 13%;
            width: 100%;
            text-align: center;
            font-size: 10vmin;
        ">
            <div onclick="$(${Action.CompleteBounty});">
                COLLECT BOUNTY
            </div>
        </div>
    `;
}
