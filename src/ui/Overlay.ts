import {GameState, PlayerState} from "../actions.js";
import {Defeat} from "./Defeat.js";
import {Victory} from "./Victory.js";

export function Overlay(state: GameState) {
    switch (state.PlayerState) {
        case PlayerState.Victory:
            return Victory();
        case PlayerState.Defeat:
            return Defeat();
        case PlayerState.None:
            return "";
    }
}
