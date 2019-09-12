import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <div style="
            margin: 3% 4%;
            font: 10vmin Impact;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </div>
    `;
}
