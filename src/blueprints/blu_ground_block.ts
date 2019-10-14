import {cull} from "../components/com_cull.js";
import {Has} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer} from "../math/random.js";
import {Model} from "../model.js";
import {main_palette, PaletteColors} from "./blu_building.js";
import {Blueprint} from "./blu_common.js";

export function get_block_blueprint(game: Game): Blueprint {
    let model = create_model();

    return {
        Translation: [0, 1.5, 0],
        Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
        Using: [render_vox(model, main_palette), cull(Has.Render)],
    };
}

function create_model() {
    let number_of_elements = integer(1, 4);
    let offsets = [];
    for (let x = 0; x < number_of_elements; x++) {
        let y = integer(-1, 1);

        offsets.push(x, 0, y, PaletteColors.light_wood);
    }

    return Float32Array.from(offsets) as Model;
}
