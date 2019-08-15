import {Game} from "./game.js";
import {load} from "./model.js";
import {world_characters} from "./worlds/wor_characters.js";

export let game = new Game();

async function start() {
    game.models = await load("/models.tfu");
    world_characters(game);
    game.start();
}

start();
