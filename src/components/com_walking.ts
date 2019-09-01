import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Walking {
    X: number;
    Y: number;
    Diagonal: boolean;
}

export function walking(X = 0, Y = 0, Diagonal = true) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Walking;
        game[Get.Walking][entity] = <Walking>{X, Y, Diagonal};
    };
}
