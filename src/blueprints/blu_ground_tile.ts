import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide, RayTarget} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {draw} from "../components/com_draw.js";
import {Has} from "../components/com_index.js";
import {navigable} from "../components/com_navigable.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, rand} from "../math/random.js";
import {widget_distance} from "../widgets/wid_distance.js";
import {main_palette, PaletteColors} from "./blu_building.js";
import {get_cactus_blueprint} from "./blu_cactus.js";
import {get_campfire_blueprint} from "./blu_campfire.js";
import {Blueprint, create_tile} from "./blu_common.js";
import {get_gold_blueprint} from "./blu_gold.js";
import {get_block_blueprint} from "./blu_ground_block.js";
import {get_rock_blueprint} from "./blu_rock.js";

export function get_tile_blueprint(
    game: Game,
    is_walkable: boolean,
    x: number = 0,
    y: number = 0,
    has_gold: boolean = true,
    colors: [number, number] = [PaletteColors.desert_ground_1, PaletteColors.desert_ground_2]
): Blueprint {
    let tile_model = create_tile(8, colors);

    let tile: Blueprint = {
        Using: [
            render_vox(tile_model, main_palette),
            cull(Has.Render),
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
        Children: [],
    };

    if (!is_walkable) {
        tile.Children!.push(
            rand() > 0.5
                ? get_cactus_blueprint(game)
                : rand() > 0.01
                ? get_rock_blueprint(game)
                : get_campfire_blueprint(game)
        );
    } else if (rand() > 0.85) {
        tile.Children!.push(get_block_blueprint(game));
    } else if (has_gold && rand() < 0.01) {
        tile.Children!.push(get_gold_blueprint(game));
    }

    return {
        Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
        Translation: [0, 0, 0],
        Using: [
            collide(false, [8, 1, 8], is_walkable ? RayTarget.Navigable : RayTarget.None),
            cull(Has.Collide),
            navigable(x, y),
            draw(widget_distance),
        ],
        Children: [tile],
    };
}
