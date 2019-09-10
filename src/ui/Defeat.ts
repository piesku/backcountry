import {Action, GameState} from "../actions.js";

export function Defeat(state: GameState) {
    return `
        <div style="
            position: absolute;
            top: 10%;
            height: 25%;
            width: 100%;
            text-align: center;
            font-size: 15vmin;
        ">
            YOU DIE WITH
            <br>
            $${state.Gold.toLocaleString("en-US")}
        </div>
        <div style="
            position: absolute;
            bottom: 13%;
            width: 100%;
            text-align: center;
            font-size: 10vmin;
        ">
            <button onclick="$(${Action.EndChallenge});">
                TRY AGAIN
            </button>
            <br>
            <button onclick="alert('Not implemented yet! You score was ${state.Gold}');">
                TWEET SCORE
            </button>
        </div>
    `;
}
