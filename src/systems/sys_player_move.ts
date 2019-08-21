import {Get} from "../components/com_index.js";
import {find_first} from "../components/com_named.js";
import {render_basic} from "../components/com_render_basic.js";
import {selectable} from "../components/com_selectable.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";

const QUERY =
    (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.Selectable) | (1 << Get.Navigable);

export function sys_player_move(game: Game, delta: number) {
    for (let i = game.world.length; i >= 0; i--) {
        if ((game.world[i] & QUERY) === QUERY) {
            let selection = game[Get.Selectable][i];
            if (selection.selected && game.event.mouse_0_down) {
                let player = find_first(game, "player");
                game[Get.ClickControl][player].destination = selection.hit;

                game.add({
                    translation: selection.hit,
                    scale: [0.2, 1, 0.2],
                    using: [
                        render_basic(game.materials[Mat.Wireframe], Cube, [0.3, 1, 1, 1]),
                        selectable(),
                    ],
                });
            }
        }
    }
}
