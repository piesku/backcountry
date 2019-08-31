import {Game} from "./game.js";
import {load} from "./model.js";
import {world_intro} from "./worlds/wor_intro.js";

export let game = new Game();

async function start() {
    game.models = await load("./models.tfu");
    world_intro(game);
    game.start();
}

start();
