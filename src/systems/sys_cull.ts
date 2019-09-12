import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {transform_point_faster} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Cull);

export function sys_cull(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

let position = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let cull = game[Get.Cull][entity];
    let world = game[Get.Transform][entity].World;
    let position = [world.m41, world.m42, world.m43];
    transform_point_faster(position, position, game.Camera!.ViewArray);
    if (
        // m11 of the ortho projection matrix is defined as 1/right. Cull
        // transforms to the left and to the right of the frustum, with a padding.
        Math.abs(position[0]) > 1 / game.Camera!.Projection.m11 + 8 ||
        // m22 of the ortho projection matrix is defined as 1/top. Cull
        // transforms above and below the frustum, with a padding.
        Math.abs(position[1]) > 1 / game.Camera!.Projection.m22 + 8
    ) {
        game.World[entity] &= ~(1 << cull.Component);
    } else {
        game.World[entity] |= 1 << cull.Component;
    }
}
