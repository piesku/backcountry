import {Action, GameState} from "../actions.js";
import {html} from "./html.js";

export function Shortcuts(state: GameState) {
    return html`
        <button onclick="$(${Action.ChangeWorld}, 'intro')" style="color: #fff">
            intro
        </button>
        <button onclick="$(${Action.ChangeWorld}, 'map', ${state.SeedPlayer})" style="color: #fff">
            map
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'house', ${state.SeedHouse || 1})"
            style="color: #fff"
        >
            house
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'wanted', ${state.SeedBounty || 1})"
            style="color: #fff"
        >
            wanted
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'desert', ${state.SeedBounty || 1})"
            style="color: #fff"
        >
            desert
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'mine', ${state.SeedBounty || 1})"
            style="color: #fff"
        >
            mine
        </button>
    `;
}
