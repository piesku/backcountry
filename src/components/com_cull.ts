import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Cull {
    Component: Get;
}

export function cull(Component: Get) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Cull;
        game[Get.Cull][entity] = <Cull>{Component};
    };
}
