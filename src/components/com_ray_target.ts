import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface RayTarget {
    Entity: Entity;
    Flags: RayFlag;
}

export function ray_target(Flags: RayFlag) {
    return (game: Game) => (Entity: Entity) => {
        game.World[Entity] |= 1 << Get.RayTarget;
        game[Get.RayTarget][Entity] = <RayTarget>{
            Entity,
            Flags,
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
