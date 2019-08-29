import {collide} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Blueprint} from "./blu_common.js";
import {create_block} from "./blu_tools.js";

let initial_palette = [1, 0.8, 0.4, 0.6, 0.4, 0];
let tile_size = 8;

export function get_mine_wall_blueprint(palette: number[] = initial_palette): Blueprint {
    let tile_model = create_block(tile_size);

    let tile: Blueprint = {
        using: [render_vox(tile_model, palette), cull(Get.Render)],
    };

    return {
        translation: [0, tile_size / 2, 0],
        using: [collide(false, [8, 1, 8]), cull(Get.Collide)],
        children: [tile],
    };
}
