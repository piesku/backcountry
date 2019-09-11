import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_forward} from "../math/mat4.js";
import {from_euler} from "../math/quat.js";
import {subtract} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Shoot);

export function sys_aim(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shoot = game[Get.Shoot][entity];
    if (shoot.Target) {
        let transform = game[Get.Transform][entity];
        let move = game[Get.Move][entity];
        let forward = get_forward([], transform.World);
        let forward_theta = Math.atan2(forward[2], forward[0]);
        let dir = subtract([], shoot.Target, transform.Translation);
        let dir_theta = Math.atan2(dir[2], dir[0]);
        move.Yaw = from_euler([], 0, (forward_theta - dir_theta) * 57, 0);
    }
}
