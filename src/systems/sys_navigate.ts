import {Get} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {rotation_to} from "../math/quat.js";
import {length, normalize, subtract, transform_point} from "../math/vec3.js";

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
        let world_position = get_translation([], transform.world);
        let world_destination = [
            control.destination![0],
            world_position[1],
            control.destination![2],
        ];
        let movement = transform_point([], world_destination, transform.self);
        normalize(movement, movement);
        let move = game[Get.Move][entity];
        move.directions.push(movement);
        move.yaws.push(rotation_to([], [0, 0, 1], movement));

        if (length(subtract([], world_destination, world_position)) < 1) {
            walking.x = control.destination_x;
            walking.y = control.destination_y;
            control.destination = null;
        }
    }
}
