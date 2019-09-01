import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {transform_point} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Cull);

export function sys_cull(game: Game, delta: number) {
    if (game.cameras[0].Cull) {
        for (let i = 0; i < game.world.length; i++) {
            if ((game.world[i] & QUERY) === QUERY) {
                update(game, i);
            }
        }
    }
}

function update(game: Game, entity: Entity) {
    let cull = game[Get.Cull][entity];
    let world_position = get_translation([], game[Get.Transform][entity].World);
    let camera_position = transform_point([], world_position, game.cameras[0].View);
    if (
        // m11 of the ortho projection matrix is defined as 1/right. Cull
        // transforms to the left and to the right of the frustum, with a padding.
        Math.abs(camera_position[0]) > 1 / game.cameras[0].Projection[0] + 8 ||
        // m22 of the ortho projection matrix is defined as 1/top. Cull
        // transforms above and below the frustum, with a padding.
        Math.abs(camera_position[1]) > 1 / game.cameras[0].Projection[5] + 8
    ) {
        game.world[entity] &= ~(1 << cull.Component);
    } else {
        game.world[entity] |= 1 << cull.Component;
    }
}
