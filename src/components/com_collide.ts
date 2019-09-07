import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface Collide {
    readonly Entity: Entity;
    New: boolean;
    /**
     * Dynamic colliders collide with all colliders. Static colliders collide
     * only with dynamic colliders.
     */
    Dynamic: boolean;
    /** The size of the collider in self units. */
    Size: [number, number, number];
    Min: Vec3;
    Max: Vec3;
    /** Collisions detected with this collider during this tick. */
    Collisions: Array<Collide>;
    Flags: RayTarget;
}

export function collide(
    Dynamic: boolean = true,
    Size: [number, number, number] = [1, 1, 1],
    Flag = RayTarget.None
) {
    return (game: Game, Entity: Entity) => {
        game.World[Entity] |= 1 << Get.Collide;
        game[Get.Collide][Entity] = <Collide>{
            Entity,
            New: true,
            Dynamic,
            Size,
            Min: [0, 0, 0],
            Max: [0, 0, 0],
            Collisions: [],
            Flags: Flag,
        };
    };
}

export const enum RayTarget {
    None = 1 << 0,
    Navigable = 1 << 1,
    Attackable = 1 << 2,
    Player = 1 << 4,
    Choosable = 1 << 5,
}
