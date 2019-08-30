import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Walking {
    x: number;
    y: number;
    diagonal: boolean;
}

export function walking(x: number = 0, y: number = 0, diagonal: boolean = true) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Walking;
        game[Get.Walking][entity] = <Walking>{x, y, diagonal};
    };
}
