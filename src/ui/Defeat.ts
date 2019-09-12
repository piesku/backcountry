import {Action, GameState} from "../actions.js";

export function Defeat(state: GameState) {
    return `
        <div>
            <div>
                YOU DIE
            </div>
            <aside>
                You earned $${state.Gold.toLocaleString("en-US")}.
            </aside>
            <div></div>
            <div style="
                display: flex;
                justify-content: space-around;
                width: 100%;
            ">
                <nav onclick="alert('Not implemented yet! You score was ${state.Gold}');">
                    Tweet Your Score
                </nav>
                <nav onclick="$(${Action.EndChallenge});">
                    Try Again
                </nav>
            </div>
        </div>
    `;
}
