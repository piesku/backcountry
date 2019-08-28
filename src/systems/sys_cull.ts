import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {get_translation} from "../math/mat4.js";
import {distance} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Cull);

export function sys_cull(game: Game, delta: number) {
    let anchor = game[Get.Transform][game.cameras[0].entity].parent;
    if (anchor) {
        let origin = get_translation([], anchor.world);
        for (let i = 0; i < game.world.length; i++) {
            if ((game.world[i] & QUERY) === QUERY) {
                update(game, i, origin);
            }
        }
    }
}

function update(game: Game, entity: Entity, origin: Vec3) {
    let cull = game[Get.Cull][entity];
    let transform = game[Get.Transform][entity];
    let world_position = get_translation([], transform.world);
    if (distance(origin, world_position) > 40) {
        game.world[entity] &= ~(1 << cull.component);
    } else {
        game.world[entity] |= 1 << cull.component;
    }
}
