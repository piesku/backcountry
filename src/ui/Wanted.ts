import {Action, GameState} from "../actions.js";

export function Wanted(state: GameState) {
    return `
        <div style="
            width: 66%;
            margin: 5% auto;
            text-align: center;
            color: #222;
        ">
            WANTED
            <div style="font-size: 7vmin;">
                REWARD $${state.ChallengeLevel},000
            </div>
        </div>
        <div onclick="$(${Action.GoToTown});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            right: 10%;
        ">
            Accept Quest
        </div>
    `;
}
