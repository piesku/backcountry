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
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let collider = game[Get.Collide][i];
            all_colliders.push(collider);

            // Prepare the collider for this tick's detection.
            collider.Collisions = [];
            if (collider.New) {
                collider.New = false;
                compute_aabb(transform, collider);
            } else if (collider.Dynamic) {
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
            collider.Collisions.push(other);
            other.Collisions.push(collider);
        }
    }
}

function compute_aabb(transform: Transform, collide: Collide) {
    let world_position = get_translation([], transform.World);
    let half = scale([], collide.Size, 0.5);
    subtract(collide.Min, world_position, half);
    add(collide.Max, world_position, half);
}

function intersect_aabb(a: Collide, b: Collide) {
    return (
        a.Min[0] < b.Max[0] &&
        a.Max[0] > b.Min[0] &&
        a.Min[1] < b.Max[1] &&
        a.Max[1] > b.Min[1] &&
        a.Min[2] < b.Max[2] &&
        a.Max[2] > b.Min[2]
    );
}
