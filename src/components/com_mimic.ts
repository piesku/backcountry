import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Mimic {
    /** Entity whose transform to mimic. */
    Target: Entity;
}

export function mimic(Target: Entity) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Mimic;
        game[Get.Mimic][entity] = <Mimic>{Target};
    };
}
