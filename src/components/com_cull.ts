import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Cull {
    Mask: number;
}

export function cull(Mask: number) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Cull;
        game[Get.Cull][entity] = <Cull>{Mask};
    };
}
