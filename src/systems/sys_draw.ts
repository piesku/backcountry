import {Get} from "../components/com_index.js";
import {Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {get_translation} from "../math/mat4.js";
import {transform_point} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Draw);

export function sys_draw(game: Game, delta: number) {
    game.Context.clearRect(0, 0, game.Canvas2.width, game.Canvas2.height);
    let position = [] as Vec3;

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            // World position.
            get_translation(position, game[Get.Transform][i].World);
            // NDC position.
            transform_point(position, position, game.Camera!.PV);

            game[Get.Draw][i].Widget(
                game,
                i,
                0.5 * (position[0] + 1) * game.Canvas3.width,
                0.5 * (-position[1] + 1) * game.Canvas3.height
            );
        }
    }
}
