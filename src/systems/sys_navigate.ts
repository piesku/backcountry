import {Get, Has} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {get_forward} from "../math/mat4.js";
import {from_euler} from "../math/quat.js";
import {length, normalize, subtract} from "../math/vec3.js";

const QUERY = Has.Transform | Has.Move | Has.Walking;

export function sys_navigate(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let walking = game[Get.Walking][entity];

    if (!walking.Destination) {
        if (walking.Route.length) {
            let dest = walking.Route.pop()!;
            let destination_entity = find_navigable(game, dest);
            walking.DestinationX = dest.X;
            walking.DestinationY = dest.Y;
            walking.Destination = game[Get.Transform][destination_entity].Translation;
        }
    }

    if (walking.Destination) {
        let transform = game[Get.Transform][entity];
        let world_destination = [
            walking.Destination[0],
            transform.Translation[1],
            walking.Destination[2],
        ];

        let dir = subtract([], world_destination, transform.Translation);
        if (length(dir) < 1) {
            walking.X = walking.DestinationX;
            walking.Y = walking.DestinationY;
            walking.Destination = null;
        }

        let move = game[Get.Move][entity];
        move.Direction = normalize(dir, dir);
        let forward = get_forward([], transform.World);
        let forward_theta = Math.atan2(forward[2], forward[0]);
        let dir_theta = Math.atan2(dir[2], dir[0]);
        move.Yaw = from_euler([], 0, (forward_theta - dir_theta) * 57, 0);
    }
}
