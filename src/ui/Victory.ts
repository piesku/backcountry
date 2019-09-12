import {Action} from "../actions.js";

export function Victory() {
    return `
        <div>
            WELL DONE
        </div>
        <div></div>
        <div onclick="$(${Action.CompleteBounty});" style="
            font: italic bold small-caps 7vmin serif;
            cursor: pointer;
        ">
            Collect Bounty
        </div>
    `;
}
