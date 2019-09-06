import {GameState} from "../actions.js";
import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {Wanted} from "./Wanted.js";

export function App(state: GameState) {
    switch (state.WorldName) {
        case "intro":
            return Intro(state.SeedPlayer);
        case "wanted":
            return Wanted(state.SeedHouse);
        default:
            return Overlay(state);
    }
}
