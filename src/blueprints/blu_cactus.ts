import {cull} from "../components/com_cull.js";
import {Has} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {integer} from "../math/random.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export function get_cactus_blueprint(game: Game): Blueprint {
    let model = game.Models[Models.CAC3];
    return {
        Translation: [0, integer(2, 5) + 0.5, 0],
        Using: [render_vox(model), cull(Has.Render)],
    };
}
