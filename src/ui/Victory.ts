import {Action} from "../actions.js";

export function Victory() {
    return `
        <div>
            <div>
                WELL DONE
            </div>
            <div></div>
            <nav onclick="$(${Action.CompleteBounty});">
                Collect Bounty
            </nav>
        </div>
    `;
}
