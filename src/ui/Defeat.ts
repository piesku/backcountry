import {Action, GameState} from "../actions.js";

export function Defeat(state: GameState) {
    return `
        <div style="
            width: 66%;
            margin: 5vh auto;
            text-align: center;
        ">
            YOU DIE
            <div style="
                font: italic 5vmin serif;
            ">
                You earned $${state.Gold.toLocaleString("en-US")}.
            </div>
        </div>

        <div style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            left: 10%;
        ">
            <a href="https://twitter.com/intent/tweet?text=I%20earned%20${
                state.Gold
            }%20in%20#backcountryrpg.">
                Tweet Your Score
            </a>
        </div>

        <div onclick="$(${Action.EndChallenge});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            right: 10%;
        ">
            Try Again
        </div>
    `;
}
