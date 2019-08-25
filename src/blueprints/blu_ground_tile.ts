import {collide} from "../components/com_collide.js";
import {navigable} from "../components/com_navigable.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";
import {get_block_blueprint} from "./blu_ground_block.js";

const tile_models = [
    Models.GROUND1,
    Models.GROUND2,
    Models.GROUND3,
    Models.GROUND4,
    Models.GROUND5,
    Models.GROUND6,
    Models.GROUND7,
    Models.GROUND7,
    Models.GROUND7,
    Models.GROUND7,
    Models.GROUND7,
];

const non_walkable_tile_models = [Models.GROUND8];

export function get_tile_blueprint(
    game: Game,
    is_walkable: boolean,
    x: number = 0,
    y: number = 0
): Blueprint {
    let tile_index = is_walkable
        ? Math.random() > 0.7
            ? tile_models[~~(Math.random() * tile_models.length)]
            : Models.GROUND7
        : non_walkable_tile_models[~~(Math.random() * non_walkable_tile_models.length)];

    let children =
        Math.random() > 0.85 && is_walkable
            ? [
                  {
                      ...get_block_blueprint(game),
                  },
              ]
            : [];

    // console.log(x, y);

    let using = is_walkable ? [ray_target(RayFlag.Navigable), navigable(x, y)] : [];
    return {
        translation: [0, 0, 0],
        rotation: [0, 1, 0, 0], //from_euler([], 0, ~~(Math.random() * 4) * 90, 0),
        using: [
            (game: Game) => render_vox(game.models[tile_index])(game),
            collide(false, [8, 1, 8]),
            // rigid_body(false),
            ...using,
        ],
        children,
    };
}
