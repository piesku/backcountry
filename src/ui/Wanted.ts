import {Action, GameState} from "../actions.js";

export function Wanted(state: GameState) {
    return `
        <div onclick="$(${Action.GoToTown});" style="
            color: #222;
            justify-content: space-around;
        ">
            <div style="
                text-align: center;
            ">
                WANTED
            </div>
            <div></div>
            <div style="
                text-align: center;
            ">
                REWARD $${state.ChallengeLevel},000
            </div>
        </div>
    `;
}
