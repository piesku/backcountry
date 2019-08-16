import {collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";

const QUERY =
    (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.Selectable) | (1 << Get.Navigable);

export function sys_navigate(game: Game, delta: number) {
    for (let i = game.world.length; i >= 0; i--) {
        if ((game.world[i] & QUERY) === QUERY) {
            let selectable = game[Get.Selectable][i];
            if (selectable.selected && game.event.mouse_0_down) {
                game.add({
                    translation: selectable.hit,
                    using: [
                        render_shaded(game.materials[Mat.Flat], Cube, [0.3, 1, 1, 1]),
                        collide(false),
                        rigid_body(false),
                    ],
                });
            }
        }
    }
}
