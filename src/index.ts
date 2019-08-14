import {Game} from "./game.js";
import {world_characters} from "./worlds/wor_characters.js";

export let game = new Game();

async function start() {
    world_characters(game);
    game.start();
}

start();
