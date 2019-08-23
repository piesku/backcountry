import {Get} from "../components/com_index.js";
import {RayFlag, ray_intersect} from "../components/com_ray_intersect.js";
import {render_basic} from "../components/com_render_basic.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";

const QUERY = (1 << Get.Transform) | (1 << Get.ClickControl);

export function sys_player_move(game: Game, delta: number) {
    if (game.event.mouse_0_down) {
        let selection = game[Get.RayCast][game.cameras[0].entity];
        if (selection.hit && selection.hit.other.mask & RayFlag.Navigable) {
            for (let i = 0; i < game.world.length; i++) {
                if ((game.world[i] & QUERY) === QUERY) {
                    game[Get.ClickControl][i].destination = selection.hit.contact;
                    game.add({
                        translation: selection.hit.contact,
                        scale: [1, 5, 1],
                        using: [
                            render_basic(game.materials[Mat.Wireframe], Cube, [0.3, 1, 1, 1]),
                            ray_intersect(RayFlag.None),
                        ],
                    });
                }
            }
        }
    }
}
