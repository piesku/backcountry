import {Get} from "../components/com_index.js";
import {RayFlag} from "../components/com_ray_target.js";
import {Entity, Game} from "../game.js";
import {get_forward, get_translation} from "../math/mat4.js";
import {raycast} from "../math/raycast.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Shoot);

export function sys_shoot(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shoot = game[Get.Shoot][entity];
    if (shoot.target) {
        console.log(`Shot fired at ${shoot.target}`);
        // TODO Play audio clip.
        // TODO Emit particles.
        // TODO Add other effects.

        let transform = game[Get.Transform][entity];
        let origin = get_translation([], transform.world);
        let direction = get_forward([], transform.world);
        let hit = raycast(game, origin, direction);
        if (hit && hit.other.flags & RayFlag.Attackable) {
            console.log(`Hit entity #${hit.other.entity}`);
        }
    }

    shoot.target = null;
}
