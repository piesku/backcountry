import {Game} from "../game.js";

let counter = document.getElementById("fps");

export function sys_framerate(game: Game, delta: number) {
    if (counter) {
        counter.textContent = (1 / delta).toFixed();
    }
}
