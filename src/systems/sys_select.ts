import {Collide, collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Vec3} from "../math/index.js";
import {normalize, subtract, transform_mat4} from "../math/vec3.js";
import {Cube} from "../shapes/Cube.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.Selectable);

export function sys_select(game: Game, delta: number) {
    let near = [
        (game.input.mouse_x / game.canvas.width) * 2 - 1,
        // In the browser, +Y is down. Invert it, so that in NDC it's up.
        -(game.input.mouse_y / game.canvas.height) * 2 + 1,
        -1,
        1,
    ];
    let far = [near[0], near[1], 1, 1];
    let camera = game.cameras[0];
    transform_mat4(near, near, camera.pv_inv);
    transform_mat4(far, far, camera.pv_inv);

    let direction = <Vec3>[0, 0, 0];
    subtract(direction, far, near);
    normalize(direction, direction);

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let aabb = game[Get.Collide][i];
            let hit = intersect([], near, direction, aabb);
            if (hit && game.event.mouse_0_down) {
                game.add({
                    translation: hit,
                    using: [
                        render_shaded(game.materials[Mat.Flat], Cube, [0.3, 1, 1, 1]),
                        collide(false),
                        rigid_body(false),
                    ],
                });
            }
        }
    }
}

function intersect(out: Vec3, ro: Vec3, rd: Vec3, aabb: Collide) {
    let d = distance(ro, rd, aabb);
    if (d === Infinity) {
        return null;
    } else {
        out[0] = ro[0] + rd[0] * d;
        out[1] = ro[1] + rd[1] * d;
        out[2] = ro[2] + rd[2] * d;
        return out;
    }
}

function distance(ro: Vec3, rd: Vec3, aabb: Collide) {
    let lo = -Infinity;
    let hi = +Infinity;

    for (let i = 0; i < 3; i++) {
        let dimLo = (aabb.min[i] - ro[i]) / rd[i];
        let dimHi = (aabb.max[i] - ro[i]) / rd[i];

        if (dimLo > dimHi) {
            [dimLo, dimHi] = [dimHi, dimLo];
        }

        if (dimHi < lo || dimLo > hi) {
            return Infinity;
        }

        if (dimLo > lo) lo = dimLo;
        if (dimHi < hi) hi = dimHi;
    }

    return lo > hi ? Infinity : lo;
}
