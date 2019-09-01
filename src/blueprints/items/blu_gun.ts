import {emit_particles} from "../../components/com_emit_particles.js";
import {render_particles} from "../../components/com_render_particles.js";
import {render_vox} from "../../components/com_render_vox.js";
import {Game} from "../../game.js";
import {from_euler} from "../../math/quat.js";
import {Models} from "../../models_map.js";
import {Blueprint} from "../blu_common.js";

export function create_gun(game: Game) {
    return <Blueprint>{
        Rotation: from_euler([], 270, 0, 0),
        Translation: [
            0,
            -(game.models[Models.GUN1].size[1] / 2 + game.models[Models.HAND].size[1] / 2),
            0,
        ],
        Using: [render_vox(game.models[Models.GUN1])],
        Children: [
            {
                Translation: [0, 1, -2],
                Using: [
                    emit_particles(0.2, 0.03, 5, 5),
                    render_particles([0.0, 0.0, 0.0], [1.0, 1.0, 1.0]),
                ],
            },
        ],
    };
}
