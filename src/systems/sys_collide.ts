import {Collide} from "../components/com_collide.js";
import {Get, Has} from "../components/com_index.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {add, scale, subtract} from "../math/vec3.js";

const QUERY = Has.Transform | Has.Collide;

export function sys_collide(game: Game, delta: number) {
    // Collect all colliders.
    let static_colliders: Collide[] = [];
    let dynamic_colliders: Collide[] = [];
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            let transform = game[Get.Transform][i];
            let collider = game[Get.Collide][i];

            // Prepare the collider for this tick's detection.
            collider.Collisions = [];
            if (collider.New) {
                collider.New = false;
                compute_aabb(transform, collider);
            } else if (collider.Dynamic) {
                compute_aabb(transform, collider);
                dynamic_colliders.push(collider);
            } else {
                static_colliders.push(collider);
            }
        }
    }

    for (let i = 0; i < dynamic_colliders.length; i++) {
        check_collisions(dynamic_colliders[i], static_colliders, static_colliders.length);
        check_collisions(dynamic_colliders[i], dynamic_colliders, i);
    }
}

/**
 * Check for collisions between a dynamic collider and other colliders. Length
 * is used to control how many colliders to check against. For collisions
 * with static colliders, length should be equal to colliders.length, since
 * we want to consider all static colliders in the scene. For collisions with
 * other dynamic colliders, we only need to check a pair of colliders once.
 * Varying length allows to skip half of the NxN checks matrix.
 *
 * @param game The game instance.
 * @param collider The current collider.
 * @param colliders Other colliders to test against.
 * @param length How many colliders to check.
 */
function check_collisions(collider: Collide, colliders: Collide[], length: number) {
    for (let i = 0; i < length; i++) {
        let other = colliders[i];
        if (intersect_aabb(collider, other)) {
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
