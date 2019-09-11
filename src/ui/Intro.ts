import {Action} from "../actions.js";

export function Intro() {
    return `
        <div style="
            left: 5%;
            display: flex;
            width: 50%;
            height: 100%;
        ">
            <div style="margin: auto 0;">
                BACK<br>COUNTRY
                <div onclick="$(${Action.GoToTown});" style="
                    border-top: 20px solid #d45230;
                ">
                    Play Now
                </div>
                <div>
                    Earn as much money as you can in today's challenge.
                    Check <a href="https://twitter.com">#backcountryrpg</a> for high scores.
                </div>
            </div>
        </div>
    `;
}
