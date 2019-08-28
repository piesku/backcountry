import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Cull {
    component: Get;
}

export function cull(component: Get) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Cull;
        game[Get.Cull][entity] = <Cull>{component};
    };
}
