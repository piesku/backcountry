import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {element} from "../math/random.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

let cacti_indexes = [Models.CAC1VOX, Models.CAC2, Models.CAC3];

export function get_cactus_blueprint(game: Game): Blueprint {
    let model = game.Models[element(cacti_indexes) as number];
    return {
        Translation: [0, model.Size![1] / 2 + 1, 0],
        Using: [render_vox(model), cull(Get.Render)],
    };
}
