import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <p style="
            margin: 5vmin;
            font: 10vmin Impact;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </p>
    `;
}
