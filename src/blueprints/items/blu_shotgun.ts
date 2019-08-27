import {emit_particles} from "../../components/com_emit_particles.js";
import {render_particles} from "../../components/com_render_particles.js";
import {render_vox} from "../../components/com_render_vox.js";
import {Game} from "../../game.js";
import {from_euler} from "../../math/quat.js";
import {Models} from "../../models_map.js";
import {Blueprint} from "../blu_common.js";

export function create_shotgun(game: Game) {
    return <Blueprint>{
        rotation: from_euler([], 270, 0, 0),
        translation: [
            0.5,
            -(
                Math.round(game.models[Models.GUN2].size[1] / 2) +
                game.models[Models.HAND].size[1] / 2
            ),
            0,
        ],
        using: [render_vox(game.models[Models.GUN2])],
        children: [
            {
                translation: [0, 1, -2],
                using: [
                    emit_particles(0.2, 0.03, 5, 5),
                    render_particles([0.0, 0.0, 0.0], [1.0, 1.0, 1.0]),
                ],
            },
        ],
    };
}
