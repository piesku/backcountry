import {Action, GameState} from "../actions.js";

export function Defeat(state: GameState) {
    return `
        <div style="
            top: 10%;
            text-align: center;
            font-size: 15vmin;
        ">
            YOU DIE WITH
            <br>
            $${state.Gold.toLocaleString("en-US")}
        </div>
        <div style="
            bottom: 10%;
            text-align: center;
            font-size: 10vmin;
        ">
            <div onclick="$(${Action.EndChallenge});">
                TRY AGAIN
            </div>
            <br>
            <div onclick="alert('Not implemented yet! You score was ${state.Gold}');">
                TWEET SCORE
            </div>
        </div>
    `;
}
