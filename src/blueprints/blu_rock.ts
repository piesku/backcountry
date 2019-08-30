import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer} from "../math/random.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export function get_rock_blueprint(game: Game): Blueprint {
    let model = game.models[Models.ROCK];
    return {
        translation: [0, ~~(model.size[1] / 2) - 2.1 * integer(0, 2), 0],
        rotation: from_euler([], integer(0, 3) * 90, integer(0, 3) * 90, integer(0, 3) * 90),
        using: [render_vox(model), cull(Get.Render)],
    };
}
