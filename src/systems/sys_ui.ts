import {Get} from "../components/com_index.js";
import {Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {get_translation} from "../math/mat4.js";
import {transform_point} from "../math/vec3.js";
import {App} from "../ui/App.js";

let prev: string;
const QUERY = (1 << Get.Transform) | (1 << Get.UI);

export function sys_ui(game: Game, delta: number) {
    let next = App(game);
    if (next !== prev) {
        game.UI2D.innerHTML = prev = next;
    }

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let position = [] as Vec3;
            get_translation(position, game[Get.Transform][i].World);
            transform_point(position, position, game.Camera!.PV);
            let ui = game[Get.UI][i];
            ui.Element.style.left = `${0.5 * (position[0] + 1) * game.Canvas.width}px`;
            ui.Element.style.top = `${0.5 * (-position[1] + 1) * game.Canvas.height}px`;
        }
    }
}
