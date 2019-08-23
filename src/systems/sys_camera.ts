import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation, invert, multiply} from "../math/mat4.js";
import {normalize, subtract, transform_point} from "../math/vec3.js";

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

    if (game.world[entity] & (1 << Get.RayCast)) {
        let ray = game[Get.RayCast][entity];
        let x = (game.input.mouse_x / game.canvas.width) * 2 - 1;
        // In the browser, +Y is down. Invert it, so that in NDC it's up.
        let y = -(game.input.mouse_y / game.canvas.height) * 2 + 1;
        let origin = [x, y, -1];
        let target = [x, y, 1];

        transform_point(origin, origin, camera.unproject);
        transform_point(ray.origin, origin, transform.world);
        transform_point(target, target, camera.unproject);
        transform_point(target, target, transform.world);
        subtract(ray.direction, target, ray.origin);
        normalize(ray.direction, ray.direction);
    }
}
