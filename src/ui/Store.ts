import {Action} from "../actions.js";

export function Store() {
    return `
        <div>
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
                <nav onclick="$(${Action.ChangePlayerSeed});">
                    Change Outfit
                </nav>
                <nav onclick="$(${Action.GoToTown});">
                    Exit to Town
                </nav>
            </div>
        </div>
    `;
}
