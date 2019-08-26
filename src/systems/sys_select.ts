import {Get} from "../components/com_index.js";
import {RayTarget} from "../components/com_ray_target.js";
import {Entity, Game} from "../game.js";
import {raycast} from "../math/raycast.js";
import {normalize, subtract, transform_point} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Camera) | (1 << Get.Select);
const TARGET = (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.RayTarget);

export function sys_select(game: Game, delta: number) {
    let targets: Array<RayTarget> = [];
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & TARGET) === TARGET) {
            targets.push(game[Get.RayTarget][i]);
        }
    }

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, targets);
        }
    }
}

function update(game: Game, entity: Entity, targets: Array<RayTarget>) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];
    let select = game[Get.Select][entity];

    let x = (game.input.mouse_x / game.canvas.width) * 2 - 1;
    // In the browser, +Y is down. Invert it, so that in NDC it's up.
    let y = -(game.input.mouse_y / game.canvas.height) * 2 + 1;
    let origin = [x, y, -1];
    let target = [x, y, 1];
    let direction = [0, 0, 0];

    transform_point(origin, origin, camera.unproject);
    transform_point(origin, origin, transform.world);
    transform_point(target, target, camera.unproject);
    transform_point(target, target, transform.world);
    subtract(direction, target, origin);
    normalize(direction, direction);
    select.hit = raycast(game, origin, direction, targets);
}
