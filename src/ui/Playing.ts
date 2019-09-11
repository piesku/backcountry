import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <div style="
            top: 5vmin;
            left: 5vmin;
            font-size: 10vmin;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </div>
    `;
}
