import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Navigable {}

export function navigable() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Navigable;
    };
}
