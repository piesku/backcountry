import {collide, RayTarget} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {rand} from "../math/random.js";
import {main_palette} from "./blu_building.js";
import {Blueprint, create_block} from "./blu_common.js";
import {create_lamp} from "./blu_lamp.js";

export function get_mine_wall_blueprint(game: Game): Blueprint {
    let tile_model = create_block(8, 6);
    let Children: Array<Blueprint> = [
        {
            Using: [render_vox(tile_model, main_palette), cull(Get.Render)],
        },
    ];

    if (rand() < 0.1) {
        Children.push(create_lamp());
    }

    return {
        Translation: [0, 4, 0],
        Using: [collide(false, [8, 4, 8], RayTarget.None), cull(Get.Collide)],
        Children,
    };
}
