import {Get, Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {transform_point} from "../math/vec3.js";

const QUERY = Has.Transform | Has.Cull;

export function sys_cull(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY && game.Camera) {
            update(game, i);
        }
    }
}

let position = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let cull = game[Get.Cull][entity];
    get_translation(position, game[Get.Transform][entity].World);
    transform_point(position, position, game.Camera!.View);
    if (
        // m11 of the ortho projection matrix is defined as 1/right. Cull
        // transforms to the left and to the right of the frustum, with a padding.
        Math.abs(position[0]) > 1 / game.Camera!.Projection[0] + 8 ||
        // m22 of the ortho projection matrix is defined as 1/top. Cull
        // transforms above and below the frustum, with a padding.
        Math.abs(position[1]) > 1 / game.Camera!.Projection[5] + 8
    ) {
        game.World[entity] &= ~(1 << cull.Component);
    } else {
        game.World[entity] |= 1 << cull.Component;
    }
}
