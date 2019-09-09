import {Game} from "./game.js";
import {load} from "./model.js";
import {world_intro} from "./worlds/wor_intro.js";

let game = new Game();
// @ts-ignore
window.$ = game.Dispatch;
// @ts-ignore
window.game = game;

async function start() {
    game.Models = await load("./models.tfu");
    world_intro(game);
    game.Start();
}

start();
