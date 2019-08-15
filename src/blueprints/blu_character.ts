import {animate} from "../components/com_animate.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {BODY, FOOT, HAND, HAT1, HAT2, HAT3, HAT4, HAT5, HAT6} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

let hat_models = [HAT1, HAT2, HAT3, HAT4, HAT5, HAT6];

export function get_hat(game: Game): Blueprint {
    let hat_index = hat_models[~~(Math.random() * hat_models.length)];
    let body_height = game.models[BODY].size[1];
    let hat_height = game.models[hat_index].size[1];

    return {
        translation: [0, hat_height / 2 + body_height / 2, 0],
        rotation: [0, 1, 0, 0],
        using: [(game: Game) => render_vox(game.models[hat_index])(game)],
    };
}

export function get_character_blueprint(game: Game): Blueprint {
    return {
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
                children: [get_hat(game)],
            },
            {
                // left hand
                translation: [1.5, 0, 0.5],
                using: [
                    animate({
                        idle: {
                            keyframes: [
                                {
                                    timestamp: 0,
                                    rotation: from_euler([], 60, 0, 0),
                                },
                                {
                                    timestamp: 0.2,
                                    rotation: from_euler([], -30, 0, 0),
                                },
                            ],
                        },
                    }),
                ],
                children: [
                    {
                        translation: [0, -1, 0],
                        using: [(game: Game) => render_vox(game.models[HAND])(game)],
                    },
                ],
            },
            {
                // right hand
                translation: [-1.5, 0, 0.5],
                using: [
                    animate({
                        idle: {
                            keyframes: [
                                {
                                    timestamp: 0,
                                    rotation: from_euler([], -30, 0, 0),
                                },
                                {
                                    timestamp: 0.2,
                                    rotation: from_euler([], 60, 0, 0),
                                },
                            ],
                        },
                    }),
                ],
                children: [
                    {
                        translation: [0, -1, 0],
                        using: [(game: Game) => render_vox(game.models[HAND])(game)],
                    },
                ],
            },
            {
                // right foot
                translation: [0.5, -2, 0.5],
                using: [
                    animate({
                        idle: {
                            keyframes: [
                                {
                                    timestamp: 0,
                                    rotation: from_euler([], -45, 0, 0),
                                },
                                {
                                    timestamp: 0.2,
                                    rotation: from_euler([], 45, 0, 0),
                                },
                            ],
                        },
                    }),
                ],
                children: [
                    {
                        translation: [0, -1.5, 0],
                        using: [(game: Game) => render_vox(game.models[FOOT])(game)],
                    },
                ],
            },
            {
                // right foot
                translation: [-0.5, -2, 0.5],
                using: [
                    animate({
                        idle: {
                            keyframes: [
                                {
                                    timestamp: 0,
                                    rotation: from_euler([], 45, 0, 0),
                                },
                                {
                                    timestamp: 0.2,
                                    rotation: from_euler([], -45, 0, 0),
                                },
                            ],
                        },
                    }),
                ],
                children: [
                    {
                        translation: [0, -1.5, 0],
                        using: [(game: Game) => render_vox(game.models[FOOT])(game)],
                    },
                ],
            },
        ],
    };
}
