import {Game} from "../game.js";
import {App} from "../ui/App.js";

let prev: string;

export function sys_ui(game: Game, delta: number) {
    let next = App(game.state);
    if (next !== prev) {
        game.ui.innerHTML = prev = next;
    }
}
