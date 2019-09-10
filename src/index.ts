import {Game} from "./game.js";
import {load} from "./model.js";
import {world_map} from "./worlds/wor_map.js";

let game = new Game();
// @ts-ignore
window.$ = game.Dispatch;
// @ts-ignore
window.game = game;

async function start() {
    game.Models = await load("./models.tfu");
    world_map(game);
    game.Start();
}

start();
