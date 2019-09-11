import {Action, GameState} from "../actions.js";

export function Wanted(state: GameState) {
    return `
        <div style="
            top: 10%;
            color: #222;
            text-align: center;
            font-size: 15vmin;
        ">
            WANTED
        </div>
        <div style="
            top: 30%;
            color: #222;
            text-align: center;
            font-size: 10vmin;
        ">
            REWARD $${state.ChallengeLevel},000
        </div>
        <div style="
            bottom: 15%;
            text-align: center;
            font-size: 10vmin;
        ">
            <div onclick="$(${Action.GoToTown});">
                ACCEPT BOUNTY
            </div>
        </div>
    `;
}
