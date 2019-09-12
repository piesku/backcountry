import {Action, GameState} from "../actions.js";

export function Wanted(state: GameState) {
    return `
        <div onclick="$(${Action.GoToTown});" style="
            color: #222;
        ">
            <div>
                WANTED
            </div>
            <div></div>
            <div style="font: 10vmin Impact">
                REWARD $${state.ChallengeLevel},000
            </div>
        </div>
    `;
}
