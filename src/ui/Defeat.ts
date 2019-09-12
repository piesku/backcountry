import {Action, GameState} from "../actions.js";

export function Defeat(state: GameState) {
    return `
        <div>
            YOU DIE
        </div>
        <div style="
            font: italic 5vmin serif;
        ">
            You earned $${state.Gold.toLocaleString("en-US")}.
        </div>
        <div></div>
        <div style="
            display: flex;
            justify-content: space-around;
            width: 100%;
        ">
            <div onclick="alert('Not implemented yet! You score was ${state.Gold}');" style="
                font: italic bold small-caps 7vmin serif;
                cursor: pointer;
            ">
                Tweet Your Score
            </div>
            <div onclick="$(${Action.EndChallenge});" style="
                font: italic bold small-caps 7vmin serif;
                cursor: pointer;
            ">
                Try Again
            </div>
        </div>
    `;
}
