import {Action, GameState} from "../actions.js";

export function Store(state: GameState) {
    return `
        <div style="
            width: 66%;
            margin: 5vh auto;
            text-align: center;
            color: #222;
        ">
            GENERAL STORE
        </div>

        <div onclick="$(${Action.ChangePlayerSeed});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 15%;
            left: 10%;
        ">
            ${
                state.MonetizationEnabled
                    ? "Change Outfit"
                    : `
                        <s>Change Outfit</s>
                        <div style="font: italic 5vmin serif;">
                            Become a Coil subscriber!
                        </div>
                    `
            }
        </div>

        <div onclick="$(${Action.GoToTown});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            right: 10%;
        ">
            Confirm
        </div>
    `;
}
