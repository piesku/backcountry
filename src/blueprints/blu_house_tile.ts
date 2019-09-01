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
import {integer} from "../math/random.js";
import {Blueprint, create_tile} from "./blu_common.js";

let house_palette = [0.6, 0.4, 0, 0.4, 0.2, 0];
let tile_size = 8;

export function get_house_tile_blueprint(game: Game, x: number = 0, y: number = 0): Blueprint {
    let tile_model = create_tile(tile_size);

    let tile: Blueprint = {
        using: [
            render_vox(tile_model, house_palette),
            cull(Get.Render),
            audio_source(),
            animate({
                [Anim.Idle]: {
                    Keyframes: [
                        {
                            Timestamp: 0,
                            Translation: [0, 0, 0],
                        },
                    ],
                },
                [Anim.Select]: {
                    Keyframes: [
                        {
                            Timestamp: 0,
                            Translation: [0, 0, 0],
                        },
                        {
                            Timestamp: 0.1,
                            Translation: [0, -0.5, 0],
                        },
                        {
                            Timestamp: 0.2,
                            Translation: [0, 0, 0],
                        },
                    ],
                    Flags: AnimationFlag.None,
                },
            }),
        ],
        children: [],
    };

    return {
        rotation: from_euler([], 0, integer(0, 3) * 90, 0),
        using: [collide(false, [8, 1, 8]), ray_target(RayFlag.Navigable), navigable(x, y)],
        children: [tile],
    };
}
