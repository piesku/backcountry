import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {rotation_to} from "../math/quat.js";
import {normalize, transform_mat4} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Move) | (1 << Get.PlayerControl);

export function sys_navigate(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game[Get.PlayerControl][entity];
    if (control.destination) {
        let transform = game[Get.Transform][entity];
        let world_position = get_translation([], transform.world);
        let world_destination = [control.destination[0], world_position[1], control.destination[2]];
        let movement = transform_mat4([], world_destination, transform.self);
        normalize(movement, movement);
        let move = game[Get.Move][entity];
        move.directions.push(movement);
        move.yaws.push(rotation_to([], [0, 0, 1], movement));
    }
}
