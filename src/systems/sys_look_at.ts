import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {rotation_to} from "../math/quat.js";
import {normalize, transform_point} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Shoot);

export function sys_look_at(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shoot = game[Get.Shoot][entity];
    if (shoot.target) {
        let transform = game[Get.Transform][entity];
        let move = game[Get.Move][entity];
        let direction = transform_point([], shoot.target, transform.self);
        direction[1] = 0;
        normalize(direction, direction);
        move.yaws.push(rotation_to([], [0, 0, 1], direction));
    }
}
