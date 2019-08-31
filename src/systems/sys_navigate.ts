import {Get} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {get_forward} from "../math/mat4.js";
import {rotation_to} from "../math/quat.js";
import {length, normalize, subtract} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Move) | (1 << Get.PathFind) | (1 << Get.Walking);

export function sys_navigate(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game[Get.PathFind][entity];
    let walking = game[Get.Walking][entity];

    if (!control.destination) {
        if (control.route.length) {
            let dest = control.route.pop() as [number, number];
            let destination_entity = find_navigable(game, dest[0], dest[1]);
            control.destination_x = dest[0];
            control.destination_y = dest[1];
            control.destination = game[Get.Transform][destination_entity].translation;
        }
    }

    if (control.destination) {
        let transform = game[Get.Transform][entity];
        let world_destination = [
            control.destination[0],
            transform.translation[1],
            control.destination[2],
        ];

        let diff = subtract([], world_destination, transform.translation);
        if (length(diff) < 1) {
            walking.x = control.destination_x;
            walking.y = control.destination_y;
            control.destination = null;
        }

        normalize(diff, diff);
        let move = game[Get.Move][entity];
        move.dir = diff;
        move.yaw = rotation_to([], get_forward([], transform.world), diff);
    }
}
