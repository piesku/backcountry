import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Shoot {}

export function shoot() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Shoot;
        game[Get.Shoot][entity] = <Shoot>{};
    };
}
