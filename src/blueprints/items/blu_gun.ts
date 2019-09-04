import {emit_particles} from "../../components/com_emit_particles.js";
import {Get} from "../../components/com_index.js";
import {light} from "../../components/com_light.js";
import {render_particles} from "../../components/com_render_particles.js";
import {render_vox} from "../../components/com_render_vox.js";
import {shake} from "../../components/com_shake.js";
import {toggle} from "../../components/com_toggle.js";
import {Game} from "../../game.js";
import {from_euler} from "../../math/quat.js";
import {Blueprint} from "../blu_common.js";

export function create_gun(game: Game) {
    return <Blueprint>{
        Rotation: from_euler([], 270, 0, 0),
        Translation: [0, -(game.Models.GUN1.Size[1] / 2 + game.Models.HAND.Size[1] / 2), 0],
        Using: [render_vox(game.Models.GUN1)],
        Children: [
            {
                Translation: [0, 1, -2],
                Using: [light([1, 1, 1], 6), toggle(Get.Light)],
                Children: [
                    {
                        Using: [
                            shake(),
                            emit_particles(0.2, 0.03, 5, 15, 5),
                            render_particles([0.0, 0.0, 0.0], [1.0, 1.0, 1.0]),
                        ],
                    },
                ],
            },
        ],
    };
}
