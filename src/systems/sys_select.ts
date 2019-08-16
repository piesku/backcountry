import {Collide, collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {selectable} from "../components/com_selectable.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Vec3} from "../math/index.js";
import {normalize, subtract, transform_mat4} from "../math/vec3.js";
import {Cube} from "../shapes/Cube.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.Selectable);

export function sys_select(game: Game, delta: number) {
    let origin = [
        (game.input.mouse_x / game.canvas.width) * 2 - 1,
        // In the browser, +Y is down. Invert it, so that in NDC it's up.
        -(game.input.mouse_y / game.canvas.height) * 2 + 1,
        -1,
        1,
    ];
    let far = [origin[0], origin[1], 1, 1];
    transform_mat4(origin, origin, game.cameras[0].pv_inv);
    transform_mat4(far, far, game.cameras[0].pv_inv);

    let direction = <Vec3>[0, 0, 0];
    subtract(direction, far, origin);
    normalize(direction, direction);

    let nearest_t = Infinity;
    let nearest_i = null;
    for (let i = game.world.length; i >= 0; i--) {
        if ((game.world[i] & QUERY) === QUERY) {
            let aabb = game[Get.Collide][i];
            let t = distance(origin, direction, aabb);
            if (t < nearest_t) {
                nearest_t = t;
                nearest_i = i;
            }
        }
    }

    if (nearest_i !== null) {
        let hit = <Vec3>[
            origin[0] + direction[0] * nearest_t,
            origin[1] + direction[1] * nearest_t,
            origin[2] + direction[2] * nearest_t,
        ];
        if (game.event.mouse_0_down) {
            game.add({
                translation: hit,
                using: [
                    render_shaded(game.materials[Mat.Flat], Cube, [0.3, 1, 1, 1]),
                    collide(false),
                    rigid_body(false),
                    selectable(),
                ],
            });
        }
    }
}

function distance(origin: Vec3, direction: Vec3, aabb: Collide) {
    let max_lo = -Infinity;
    let min_hi = +Infinity;

    for (let i = 0; i < 3; i++) {
        let lo = (aabb.min[i] - origin[i]) / direction[i];
        let hi = (aabb.max[i] - origin[i]) / direction[i];

        if (lo > hi) {
            [lo, hi] = [hi, lo];
        }

        if (hi < max_lo || lo > min_hi) {
            return Infinity;
        }

        if (lo > max_lo) max_lo = lo;
        if (hi < min_hi) min_hi = hi;
    }

    return max_lo > min_hi ? Infinity : max_lo;
}
