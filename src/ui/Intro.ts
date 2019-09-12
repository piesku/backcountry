import {Action} from "../actions.js";

export function Intro() {
    return `
        <div style="
            flex: none;
            width: 66%;
        ">
            <div style="margin: auto 0;">
                BACK<br>COUNTRY
                <div onclick="$(${Action.GoToTown});" style="
                    border-top: 20px solid #d45230;
                    font: italic bold small-caps 15vmin serif;
                    cursor: pointer;
                ">
                    Play Now
                </div>
                <div style="
                    font: italic 5vmin serif;
                ">
                    Earn as much money as you can in today's challenge.
                    Check <a href="https://twitter.com">#backcountryrpg</a> for high scores.
                </div>
            </div>
        </div>
    `;
}
