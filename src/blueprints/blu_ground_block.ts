import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, rand} from "../math/random.js";
import {Model} from "../model.js";
import {Blueprint} from "./blu_common.js";

let palette = [0.6, 0.4, 0];

export function get_block_blueprint(game: Game): Blueprint {
    let model = create_model();

    return {
        Translation: [0, model.size[1] / 2 + 1, 0],
        Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
        Using: [render_vox(model, palette), cull(Get.Render)],
    };
}

function create_model() {
    let number_of_elements = integer(1, 4);
    let offsets = [];
    let is_double = false;
    for (let x = 0; x < number_of_elements; x++) {
        let y = integer(-1, 1);

        offsets.push(x, 0, y, 0);

        if (rand() < 0.3 && !is_double) {
            is_double = true;
            offsets.push(x, 1, y, 0);
        }
    }

    return {
        offsets: Float32Array.from(offsets),
        size: [1, 1, 1],
    } as Model;
}
