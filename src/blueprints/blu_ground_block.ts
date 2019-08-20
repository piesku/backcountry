import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

const block_models = [Models.BLOCK1, Models.BLOCK2, Models.BLOCK3, Models.BLOCK4, Models.BLOCK5];

export function get_block_blueprint(game: Game): Blueprint {
    let block_index = block_models[~~(Math.random() * block_models.length)];

    return {
        translation: [0, game.models[block_index].size[1] / 2 + 1, 0],
        rotation: from_euler([], 0, ~~(Math.random() * 4) * 90, 0),
        using: [(game: Game) => render_vox(game.models[block_index])(game)],
    };
}
