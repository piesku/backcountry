import {Game} from "./game.js";
import {load} from "./model.js";
import {world_intro} from "./worlds/wor_town.js";

let game = new Game();
// @ts-ignore
window.$ = game.Dispatch;
// @ts-ignore
window.game = game;

load("./models.tfu").then(models => {
    game.Models = models;
    world_intro(game);
    game.Start();
});
