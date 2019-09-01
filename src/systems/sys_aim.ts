import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_forward} from "../math/mat4.js";
import {rotation_to} from "../math/quat.js";
import {normalize, subtract} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Shoot);

export function sys_aim(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shoot = game[Get.Shoot][entity];
    if (shoot.Target) {
        let transform = game[Get.Transform][entity];
        let move = game[Get.Move][entity];

        let diff = subtract([], shoot.Target, transform.translation);
        diff[1] = 0;
        normalize(diff, diff);
        move.Yaw = rotation_to([], get_forward([], transform.world), diff);
    }
}
