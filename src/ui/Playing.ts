import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <div style="
            margin: 3vmin 4vmin;
            font: 10vmin Impact;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </div>
    `;
}
