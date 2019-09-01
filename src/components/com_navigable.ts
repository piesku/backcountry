import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Navigable {
    X: number;
    Y: number;
}

export function navigable(X: number, Y: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Navigable;
        game[Get.Navigable][entity] = <Navigable>{X, Y};
    };
}

export function find_navigable(game: Game, x: number, y: number) {
    for (let i = 0; i < game.world.length; i++) {
        if (game.world[i] & (1 << Get.Navigable)) {
            if (game[Get.Navigable][i].X === x && game[Get.Navigable][i].Y === y) {
                return i;
            }
        }
    }
    throw `No entity with coords ${x}, ${y}.`;
}
