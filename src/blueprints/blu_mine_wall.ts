import {collide} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {rand} from "../math/random.js";
import {Blueprint, create_block} from "./blu_common.js";
import {lamp_blueprint} from "./blu_lamp.js";

let initial_palette = [1, 0.8, 0.4, 0.6, 0.4, 0];
let tile_size = 8;

export function get_mine_wall_blueprint(palette: number[] = initial_palette): Blueprint {
    let tile_model = create_block(tile_size, ~~(tile_size * 0.78));

    let Children: Array<Blueprint> = [
        {
            Using: [render_vox(tile_model, palette), cull(Get.Render)],
        },
    ];

    if (rand() < 0.1) {
        Children.push(lamp_blueprint);
    }

    return {
        Translation: [0, tile_size / 2, 0],
        Using: [collide(false, [8, 1, 8]), cull(Get.Collide)],
        Children,
    };
}
