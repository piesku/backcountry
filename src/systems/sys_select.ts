import {Collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {Game} from "../game.js";
import {Vec3} from "../math/index.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.Selectable);

export function sys_select(game: Game, delta: number) {
    let camera = game.cameras[0];
    let nearest_t = Infinity;
    let nearest_i = null;
    for (let i = game.world.length; i >= 0; i--) {
        if ((game.world[i] & QUERY) === QUERY) {
            // Reset the selection.
            game[Get.Selectable][i].selected = false;
            let t = distance(camera.ray_origin, camera.ray_direction, game[Get.Collide][i]);
            if (t < nearest_t) {
                nearest_t = t;
                nearest_i = i;
            }
        }
    }

    if (nearest_i !== null) {
        let selectable = game[Get.Selectable][nearest_i];
        selectable.selected = true;
        selectable.hit = [
            camera.ray_origin[0] + camera.ray_direction[0] * nearest_t,
            camera.ray_origin[1] + camera.ray_direction[1] * nearest_t,
            camera.ray_origin[2] + camera.ray_direction[2] * nearest_t,
        ];
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
