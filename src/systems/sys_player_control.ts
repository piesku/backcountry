import {Get} from "../components/com_index.js";
import {RayCast} from "../components/com_ray_cast.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {render_basic} from "../components/com_render_basic.js";
import {Entity, Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";

const QUERY = (1 << Get.Transform) | (1 << Get.PlayerControl);

export function sys_player_control(game: Game, delta: number) {
    let camera = game.cameras[0];
    if (game.world[camera.entity] & (1 << Get.RayCast)) {
        let ray = game[Get.RayCast][camera.entity];
        for (let i = 0; i < game.world.length; i++) {
            if ((game.world[i] & QUERY) === QUERY) {
                update(game, i, ray);
            }
        }
    }
}

function update(game: Game, entity: Entity, ray: RayCast) {
    if (game.event.mouse_0_down) {
        if (ray.hit) {
            if (ray.hit.other.flags & RayFlag.Navigable) {
                game[Get.ClickControl][entity].destination = ray.hit.contact;
                game.add({
                    translation: ray.hit.contact,
                    scale: [1, 5, 1],
                    using: [
                        render_basic(game.materials[Mat.Wireframe], Cube, [0.3, 1, 1, 1]),
                        ray_target(RayFlag.None),
                    ],
                });
            }
            if (ray.hit.other.flags & RayFlag.Attackable) {
                console.log(`Shoot at entity #${ray.hit.other.entity}.`);
            }
        }
    }

    if (game.event.mouse_2_down) {
        if (ray.hit) {
            console.log(`Shoot at position ${ray.hit.contact}.`);
        }
    }
}
