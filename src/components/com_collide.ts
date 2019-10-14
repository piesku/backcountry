import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get, Has} from "./com_index.js";

export interface Collide {
    readonly EntityId: Entity;
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
    return (game: Game, EntityId: Entity) => {
        game.World[EntityId] |= Has.Collide;
        game[Get.Collide][EntityId] = <Collide>{
            EntityId,
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
    /** Ignored by raycasting. */
    None = 1 << 0,
    /** Considered by raycasting; doesn't do anything. */
    Targetable = 1 << 1,
    /** Can be walked to. */
    Navigable = 1 << 2,
    /** Can be attacked. */
    Attackable = 1 << 3,
    /** The player; used with Anim.Select when playing. */
    Player = 1 << 4,
}
