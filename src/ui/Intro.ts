import {Action} from "../actions.js";

export function Intro() {
    return `
        <div style="
            position: absolute;
            left: 50%;
            display: flex;
            height: 100%;
        ">
            <div style="margin: auto 0; font-size: 15vh;">
                BACK<br/>COUNTRY
                <hr style="border: solid #D45230 10px;" />
                <button onclick="$(${Action.GoToTown});">
                    PLAY
                </button>
            </div>
        </div>
    `;
}
