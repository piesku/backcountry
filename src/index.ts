import { Game } from "./game.js";
import { load } from "./model.js";
import { world_map } from "./worlds/wor_map.js";

export let game = new Game();

async function start() {
    game.models = await load("/models.tfu");
    world_map(game);
    game.start();
}

start();
