import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface RayIntersect {
    mask: RayFlag;
}

export function ray_intersect(mask: RayFlag) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.RayIntersect;
        game[Get.RayIntersect][entity] = <RayIntersect>{
            mask,
        };
    };
}

export const enum RayFlag {
    None = 0,
    Navigable = 1 << 0,
}
