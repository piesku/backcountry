import {Collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {add, scale, subtract} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Collide);

export function sys_collide(game: Game, delta: number) {
    // Collect all colliders.
    let all_colliders: Collide[] = [];
    let dyn_colliders: Collide[] = [];
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let collider = game[Get.Collide][i];
            all_colliders.push(collider);

            // Prepare the collider for this tick's detection.
            collider.collisions = [];
            if (collider.new) {
                collider.new = false;
                compute_aabb(transform, collider);
            } else if (collider.dynamic) {
                compute_aabb(transform, collider);
                dyn_colliders.push(collider);
            }
        }
    }

    for (let i = 0; i < dyn_colliders.length; i++) {
        check_collisions(dyn_colliders[i], all_colliders);
    }
}

/**
 * Check for collisions between a dynamic collider and all others.
 *
 * @param game The game instance.
 * @param collider The current collider.
 * @param colliders All other colliders.
 */
function check_collisions(collider: Collide, colliders: Collide[]) {
    for (let i = 0; i < colliders.length; i++) {
        let other = colliders[i];
        if (collider !== other && intersect_aabb(collider, other)) {
            collider.collisions.push(other);
            other.collisions.push(collider);
        }
    }
}

function compute_aabb(transform: Transform, collide: Collide) {
    let world_position = get_translation([], transform.world);
    let half = scale([], collide.size, 0.5);
    subtract(collide.min, world_position, half);
    add(collide.max, world_position, half);
}

function intersect_aabb(a: Collide, b: Collide) {
    return (
        a.min[0] < b.max[0] &&
        a.max[0] > b.min[0] &&
        a.min[1] < b.max[1] &&
        a.max[1] > b.min[1] &&
        a.min[2] < b.max[2] &&
        a.max[2] > b.min[2]
    );
}
