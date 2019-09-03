import {cull} from "../components/com_cull.js";
import {emit_particles} from "../components/com_emit_particles.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {render_particles} from "../components/com_render_particles.js";
import {render_vox} from "../components/com_render_vox.js";
import {shake} from "../components/com_shake.js";
import {Game} from "../game.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export function get_campfire_blueprint(game: Game): Blueprint {
    return {
        Translation: [0, 2, 0],
        Using: [render_vox(game.Models[Models.CAMPFIRE]), cull(Get.Render)],
        Children: [
            {
                Using: [
                    shake(Infinity),
                    emit_particles(2, 0.1, 15, 1, 10, Infinity),
                    render_particles([1, 0, 0], [1, 1, 0]),
                ],
            },
            {
                Translation: [0, 3, 0],
                Using: [light([1, 0.5, 0], 3), cull(Get.Light)],
            },
        ],
    };
}
