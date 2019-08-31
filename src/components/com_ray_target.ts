import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface RayTarget {
    entity: Entity;
    flags: RayFlag;
}

export function ray_target(flags: RayFlag) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.RayTarget;
        game[Get.RayTarget][entity] = <RayTarget>{
            entity,
            flags,
        };
    };
}

export const enum RayFlag {
    None = 1 << 0,
    Navigable = 1 << 1,
    Attackable = 1 << 2,
    Interactable = 1 << 3,
    Player = 1 << 4,
}
