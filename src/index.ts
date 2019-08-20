import {Game} from "./game.js";
import {load} from "./model.js";
import {world_stage} from "./worlds/wor_stage.js";

export let game = new Game();

async function start() {
    game.models = await load("/models.tfu");
    world_stage(game);
    game.start();
}

start();
