import {animate, AnimationFlag} from "../components/com_animate.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {navigable} from "../components/com_navigable.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Models} from "../models_map.js";
import {snd_click} from "../sounds/snd_click.js";
import {Blueprint} from "./blu_common.js";
import {get_block_blueprint} from "./blu_ground_block.js";
import {create_tile} from "./blu_tools.js";

let palette = [1, 0.8, 0.4, 0.6, 0.4, 0];
let tile_size = 8;

let non_walkable_tile_models = [Models.GROUND8];

export function get_tile_blueprint(
    game: Game,
    is_walkable: boolean,
    x: number = 0,
    y: number = 0
): Blueprint {
    let tile_model = is_walkable
        ? create_tile(tile_size)
        : game.models[
              non_walkable_tile_models[~~(Math.random() * non_walkable_tile_models.length)]
          ];

    let tile: Blueprint = {
        using: [
            render_vox(tile_model, palette),
            cull(Get.Render),
            audio_source({select: snd_click}),
            animate({
                idle: {
                    keyframes: [
                        {
                            timestamp: 0,
                            translation: [0, 0, 0],
                        },
                    ],
                },
                select: {
                    keyframes: [
                        {
                            timestamp: 0,
                            translation: [0, 0, 0],
                        },
                        {
                            timestamp: 0.1,
                            translation: [0, -0.5, 0],
                        },
                        {
                            timestamp: 0.2,
                            translation: [0, 0, 0],
                        },
                    ],
                    flags: AnimationFlag.None,
                },
            }),
        ],
    };

    if (Math.random() > 0.85 && is_walkable) {
        tile.children = [get_block_blueprint(game)];
    }

    let using = is_walkable ? [ray_target(RayFlag.Navigable), navigable(x, y)] : [];
    return {
        translation: [0, 0, 0],
        rotation: [0, 1, 0, 0], //from_euler([], 0, ~~(Math.random() * 4) * 90, 0),
        using: [
            collide(false, [8, 1, 8]),
            cull(Get.Collide),
            // rigid_body(false),
            ...using,
        ],
        children: [tile],
    };
}
