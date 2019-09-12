import {Action} from "../actions.js";

export function Victory() {
    return `
        <div style="
            width: 66%;
            margin: 5% auto;
            text-align: center;
        ">
            WELL DONE
        </div>

        <div onclick="$(${Action.CompleteBounty});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            right: 10%;
        ">
            Collect Bounty
        </div>
    `;
}
