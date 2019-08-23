import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_forward, get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.RayCast) | (1 << Get.Shoot);

export function sys_aim(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let ray = game[Get.RayCast][entity];
    get_translation(ray.origin, transform.world);
    get_forward(ray.direction, transform.world);
}
