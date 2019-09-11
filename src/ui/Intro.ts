import {Action} from "../actions.js";

export function Intro() {
    return `
        <div style="
            margin-left: 5%;
            width: 66%;
        ">
            <div style="margin: auto 0;">
                BACK<br>COUNTRY
                <nav onclick="$(${Action.GoToTown});" style="
                    border-top: 20px solid #d45230;
                ">
                    Play Now
                </nav>
                <div>
                    Earn as much money as you can in today's challenge.
                    Check <a href="https://twitter.com">#backcountryrpg</a> for high scores.
                </div>
            </div>
        </div>
    `;
}
