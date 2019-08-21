import {collide} from "../components/com_collide.js";
import {navigable} from "../components/com_navigable.js";
import {render_vox} from "../components/com_render_vox.js";
import {selectable} from "../components/com_selectable.js";
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

export function get_tile_blueprint(game: Game): Blueprint {
    let is_walkable = Math.random() > 0.04;

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

    return {
        translation: [0, 0, 0],
        rotation: [0, 1, 0, 0], //from_euler([], 0, ~~(Math.random() * 4) * 90, 0),
        using: [
            (game: Game) => render_vox(game.models[tile_index])(game),
            collide(false, [8, 1, 8]),
            // rigid_body(false),
            selectable(),
            navigable(),
        ],
        children,
    };
}
