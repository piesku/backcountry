import {Animate} from "../components/com_animate.js";
import {Get} from "../components/com_index.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {Quat, Vec3} from "../math/index.js";
import {multiply} from "../math/quat.js";
import {add, normalize, scale} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Move);

export function sys_move(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let move = game[Get.Move][entity];
    for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
        if (!animate.trigger) {
            animate.trigger = move.directions.length ? "move" : "idle";
        }
    }

    if (move.directions.length) {
        let direction = move.directions.reduce(add_directions);
        normalize(direction, direction);
        scale(direction, direction, move.move_speed * delta);
        add(transform.translation, transform.translation, direction);
        transform.dirty = true;
        move.directions = [];
    }

    if (move.yaws.length) {
        let yaw = move.yaws.reduce(multiply_rotations);
        // Yaw is applied relative to the world space.
        multiply(transform.rotation, yaw, transform.rotation);
        transform.dirty = true;
        move.yaws = [];
    }
}

function add_directions(acc: Vec3, cur: Vec3) {
    return add(acc, acc, cur);
}

function multiply_rotations(acc: Quat, cur: Quat) {
    return multiply(acc, acc, cur);
}
