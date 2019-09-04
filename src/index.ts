import {Game} from "./game.js";
import {world_intro} from "./worlds/wor_intro.js";

let game = new Game();
// @ts-ignore
window.$ = game.Dispatch;
// @ts-ignore
window.game = game;

world_intro(game);
game.Start();
