import {Action} from "../actions.js";

export function Victory() {
    return `
        <div style="
            top: 10%;
            text-align: center;
            font-size: 15vmin;
        ">
            VICTORY
        </div>
        <div style="
            bottom: 13%;
            text-align: center;
            font-size: 10vmin;
        ">
            <div onclick="$(${Action.CompleteBounty});">
                COLLECT BOUNTY
            </div>
        </div>
    `;
}
