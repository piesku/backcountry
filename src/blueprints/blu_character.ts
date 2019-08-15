import {animate} from "../components/com_animate.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {BODY, HAT1, HAT2, HAT3, HAT4, HAT5, HAT6} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

let hat_models = [HAT1, HAT2, HAT3, HAT4, HAT5, HAT6];

export function get_hat(): Blueprint {
    let hat_index = hat_models[~~(Math.random() * hat_models.length)];

    console.log(hat_index);

    return {
        rotation: [0, 1, 0, 0],
        using: [(game: Game) => render_vox(game.models[hat_index])(game)],
    };
}

export let character_blueprint: Blueprint = {
    rotation: [0, 1, 0, 0],
    scale: [0.2, 0.2, 0.2],
    children: [
        {
            //body
            using: [
                (game: Game) => render_vox(game.models[BODY])(game),
                animate({
                    idle: {
                        keyframes: [
                            {
                                timestamp: 0.0,
                                rotation: from_euler([], 0, 5, 0),
                            },
                            {
                                timestamp: 0.2,
                                rotation: from_euler([], 0, -5, 0),
                            },
                        ],
                    },
                }),
            ],
        },
    ],
};
