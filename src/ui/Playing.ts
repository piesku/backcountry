import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <div style="
            margin: 4% 5%;
            font: 10vmin Impact;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </div>
    `;
}
