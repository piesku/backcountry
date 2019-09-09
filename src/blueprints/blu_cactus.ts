import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {element} from "../math/random.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

let cacti_indexes_and_heights = [[Models.CAC1VOX, 4], [Models.CAC2, 3], [Models.CAC3, 4.5]];

export function get_cactus_blueprint(game: Game): Blueprint {
    let cacti = element(cacti_indexes_and_heights);

    let model = game.Models[(cacti as any)[0] as number];
    return {
        Translation: [0, (cacti as any)[1], 0],
        Using: [render_vox(model), cull(Get.Render)],
    };
}
