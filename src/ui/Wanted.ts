import {Action, GameState} from "../actions.js";

export function Wanted(state: GameState) {
    return `
        <div style="color: #222">
            WANTED
        </div>
        <div style="font-size: 7vmin; color: #222">
            REWARD $${state.ChallengeLevel},000
        </div>
        <div style="flex: 2;"></div>
        <nav onclick="$(${Action.GoToTown});">
            Accept Quest
        </nav>
    `;
}
