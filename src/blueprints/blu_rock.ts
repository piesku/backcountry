import {cull} from "../components/com_cull.js";
import {Has} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer} from "../math/random.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export function get_rock_blueprint(game: Game): Blueprint {
    let model = game.Models[Models.ROCK];
    return {
        Translation: [0.1, integer(0, 2) + 0.1, 0.1],
        Rotation: from_euler([], integer(0, 3) * 90, integer(0, 3) * 90, integer(0, 3) * 90),
        Using: [render_vox(model), cull(Has.Render)],
    };
}
