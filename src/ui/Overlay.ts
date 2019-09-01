import {Action, GameState} from "../actions.js";
import {html} from "./html.js";

export function Overlay(state: GameState) {
    return html`
        <button onclick="$(${Action.ChangeWorld}, 'intro')" style="color: #fff">
            intro
        </button>
        <button onclick="$(${Action.ChangeWorld}, 'map', ${state.seed_town})" style="color: #fff">
            map
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'house', ${state.seed_house || 1})"
            style="color: #fff"
        >
            house
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'wanted', ${state.seed_bounty || 1})"
            style="color: #fff"
        >
            wanted
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'desert', ${state.seed_bounty || 1})"
            style="color: #fff"
        >
            desert
        </button>
        <button
            onclick="$(${Action.ChangeWorld}, 'mine', ${state.seed_bounty || 1})"
            style="color: #fff"
        >
            mine
        </button>
    `;
}
