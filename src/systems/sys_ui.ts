import {Get} from "../components/com_index.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {transform_point} from "../math/vec3.js";
import {App} from "../ui/App.js";

let prev: string;
const QUERY = (1 << Get.Transform) | (1 << Get.UI);

export function sys_ui(game: Game, delta: number) {
    let next = App(game);
    if (next !== prev) {
        game.HUD.innerHTML = prev = next;
    }

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let ui = game[Get.UI][i];
            if (ui.Lifespan < 0) {
                ui.Element.remove();
            } else {
                ui.Lifespan -= delta;

                let ndc_position = transform_point(
                    [],
                    get_translation([], game[Get.Transform][i].World),
                    game.Camera!.PV
                );
                ui.Element.style.left = `${0.5 * (ndc_position[0] + 1) * game.Canvas.width}px`;
                ui.Element.style.top = `${0.5 * (-ndc_position[1] + 1) * game.Canvas.height}px`;
            }
        }
    }
}
