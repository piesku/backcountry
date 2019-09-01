import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {navigable} from "../components/com_navigable.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, rand} from "../math/random.js";
import {get_cactus_blueprint} from "./blu_cactus.js";
import {Blueprint} from "./blu_common.js";
import {get_block_blueprint} from "./blu_ground_block.js";
import {get_rock_blueprint} from "./blu_rock.js";
import {create_tile} from "./blu_tools.js";

let initial_palette = [1, 0.8, 0.4, 0.6, 0.4, 0];
let tile_size = 8;

export function get_tile_blueprint(
    game: Game,
    is_walkable: boolean,
    x: number = 0,
    y: number = 0,
    palette: number[] = initial_palette
): Blueprint {
    let tile_model = create_tile(tile_size);

    let tile: Blueprint = {
        using: [
            render_vox(tile_model, palette),
            cull(Get.Render),
            audio_source(),
            animate({
                [Anim.Idle]: {
                    keyframes: [
                        {
                            timestamp: 0,
                            translation: [0, 0, 0],
                        },
                    ],
                },
                [Anim.Select]: {
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
        children: [],
    };

    if (rand() > 0.85 && is_walkable) {
        tile.children!.push(get_block_blueprint(game));
    }

    if (!is_walkable) {
        tile.children!.push(rand() > 0.5 ? get_cactus_blueprint() : get_rock_blueprint(game));
    }

    let using = is_walkable ? [ray_target(RayFlag.Navigable), navigable(x, y)] : [];
    return {
        translation: [0, 0, 0],
        rotation: from_euler([], 0, integer(0, 3) * 90, 0),
        using: [collide(false, [8, 1, 8]), cull(Get.Collide), ...using],
        children: [tile],
    };
}
