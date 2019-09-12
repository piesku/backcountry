import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <div style="
            position: absolute;
            left: 5vmin;
            top: 4vmin;
            font: 10vmin Impact;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </div>
    `;
}
