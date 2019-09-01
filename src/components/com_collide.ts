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
}

export function collide(Dynamic: boolean = true, Size: [number, number, number] = [1, 1, 1]) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Collide;
        game[Get.Collide][entity] = <Collide>{
            Entity: entity,
            New: true,
            Dynamic,
            Size,
            Min: [0, 0, 0],
            Max: [0, 0, 0],
            Collisions: [],
        };
    };
}
