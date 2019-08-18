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

export function get_tile_blueprint(game: Game): Blueprint {
    let tile_index =
        Math.random() > 0.7 ? tile_models[~~(Math.random() * tile_models.length)] : Models.GROUND7;

    let children =
        Math.random() > 0.85
            ? [
                  {
                      ...get_block_blueprint(game),
                  },
              ]
            : [];

    return {
        translation: [0, 0, 0],
        rotation: [0, 1, 0, 0], //from_euler([], 0, ~~(Math.random() * 4) * 90, 0),
        scale: [0.2, 0.2, 0.2],
        using: [
            (game: Game) => render_vox(game.models[tile_index])(game),
            collide(false),
            // rigid_body(false),
            selectable(),
            navigable(),
        ],
        children,
    };
}
