import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <p style="
            position: absolute;
            left: 5vmin;
            top: -5vmin;
            font: 10vmin Impact;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </p>
    `;
}
