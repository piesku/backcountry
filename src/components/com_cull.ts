import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Cull {
    Component: Get;
}

export function cull(Component: Get) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Cull;
        game[Get.Cull][entity] = <Cull>{Component};
    };
}
