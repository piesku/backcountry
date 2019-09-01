import {Get} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {get_forward} from "../math/mat4.js";
import {from_axis} from "../math/quat.js";
import {length, normalize, subtract} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Move) | (1 << Get.PathFind) | (1 << Get.Walking);

export function sys_navigate(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game[Get.PathFind][entity];
    let walking = game[Get.Walking][entity];

    if (!control.Destination) {
        if (control.Route.length) {
            let dest = control.Route.pop() as [number, number];
            let destination_entity = find_navigable(game, dest[0], dest[1]);
            control.DestinationX = dest[0];
            control.DestinationY = dest[1];
            control.Destination = game[Get.Transform][destination_entity].Translation;
        }
    }

    if (control.Destination) {
        let transform = game[Get.Transform][entity];
        let world_destination = [
            control.Destination[0],
            transform.Translation[1],
            control.Destination[2],
        ];

        let dir = subtract([], world_destination, transform.Translation);
        if (length(dir) < 1) {
            walking.X = control.DestinationX;
            walking.Y = control.DestinationY;
            control.Destination = null;
        }

        normalize(dir, dir);
        let move = game[Get.Move][entity];
        move.Direction = dir;
        let forward = get_forward([], transform.World);
        let forward_theta = Math.atan2(forward[2], forward[0]);
        let dir_theta = Math.atan2(dir[2], dir[0]);
        move.Yaw = from_axis([], [0, 1, 0], forward_theta - dir_theta);
    }
}
