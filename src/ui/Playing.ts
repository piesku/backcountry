import {GameState} from "../actions.js";

export function Playing(state: GameState) {
    return `
        <div style="
            position: absolute;
            top: 10%;
            left: 10%;
            font-size: 10vh;
        ">
            $${state.Gold.toLocaleString("en-US")}
        </div>
    `;
}
