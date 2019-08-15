import {render_vox} from "../../components/com_render_vox.js";
import {Game} from "../../game.js";
import {from_euler} from "../../math/quat.js";
import {Models} from "../../models_map.js";

export function create_shotgun(game: Game) {
    return {
        rotation: from_euler([], 270, 0, 0),
        translation: [
            0.5,
            -(
                Math.round(game.models[Models.GUN2].size[1] / 2) +
                game.models[Models.HAND].size[1] / 2
            ),
            0,
        ],
        using: [(game: Game) => render_vox(game.models[Models.GUN2])(game)],
    };
}
