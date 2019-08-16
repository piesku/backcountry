import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation, invert, multiply} from "../math/mat4.js";
import {normalize, subtract, transform_mat4} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Camera);

export function sys_camera(game: Game, delta: number) {
    game.cameras = [];
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];
    game.cameras.push(camera);
    get_translation(camera.position, transform.world);
    invert(camera.view, transform.world);
    multiply(camera.pv, camera.projection, camera.view);
    invert(camera.pv_inv, camera.pv);

    let origin = [
        (game.input.mouse_x / game.canvas.width) * 2 - 1,
        // In the browser, +Y is down. Invert it, so that in NDC it's up.
        -(game.input.mouse_y / game.canvas.height) * 2 + 1,
        -1,
        1,
    ];
    let far = [origin[0], origin[1], 1, 1];
    transform_mat4(camera.ray_origin, origin, game.cameras[0].pv_inv);
    transform_mat4(far, far, game.cameras[0].pv_inv);
    subtract(camera.ray_direction, far, origin);
    normalize(camera.ray_direction, camera.ray_direction);
}
