import {Action} from "../actions.js";
import {collide} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {trigger} from "../components/com_trigger.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer} from "../math/random.js";
import {BuildingColors, main_building_palette} from "./blu_building.js";
import {Blueprint, create_line} from "./blu_common.js";

export function get_gold_blueprint(game: Game): Blueprint {
    return {
        Translation: [0, 1.5, 0],
        Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
        Using: [
            render_vox(
                {
                    Offsets: Float32Array.from(
                        create_line([-1, 0, 0], [1, 0, 0], BuildingColors.gold)
                    ),
                },
                main_building_palette
            ),
            cull(Get.Render),
            collide(false, [4, 4, 4]),
            trigger(Action.CollectGold),
        ],
    };
}