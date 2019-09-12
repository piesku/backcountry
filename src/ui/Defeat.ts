import {Action, GameState} from "../actions.js";

export function Defeat(state: GameState) {
    return `
        <div style="
            width: 66%;
            margin: auto;
            text-align: center;
        ">
            YOU DIE
            <div style="
                font: italic 5vmin serif;
            ">
                You earned $${state.Gold.toLocaleString("en-US")}.
            </div>
        </div>

        <div onclick="alert('Not implemented yet! You score was ${state.Gold}');" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            left: 10%;
        ">
            Tweet Your Score
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
