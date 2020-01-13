import {Action} from "../actions.js";

export function Intro() {
    return `
        <div style="
            width: 66%;
            margin: 10vh auto;
        ">
            BACK<br>COUNTRY
            <div onclick="$(${Action.GoToTown});" style="
                font: italic bold small-caps 13vmin serif;
                border-top: 20px solid #d45230;
            ">
                Play Now
            </div>
            <div style="
                font: italic 5vmin serif;
            ">
                Earn as much money as you can in today's challenge.
            </div>
        </div>
    `;
}
