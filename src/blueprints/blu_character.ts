import {animate} from "../components/com_animate.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {BODY, FOOT, HAND, HAT1, HAT2, HAT3, HAT4, HAT5, HAT6} from "../models_map.js";
import {palette} from "../palette.js";
import {Blueprint} from "./blu_common.js";

let hat_models = [HAT1, HAT2, HAT3, HAT4, HAT5, HAT6];

// const enum CustomColorIndex {
//     Shirt = 0,
//     Pants = 1,
//     Hat = 2,
//     Extra = 3,
// }

interface CustomColors {
    shirt?: [number, number, number];
    pants?: [number, number, number];
    hat?: [number, number, number];
    extra?: [number, number, number];
}

let shirt_colors: Array<[number, number, number]> = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]];

let pants_colors: Array<[number, number, number]> = [
    [0, 0, 0],
    [0.53, 0, 0],
    [0.53, 0, 0],
    [0.6, 0.4, 0.2],
    [0.33, 0.33, 0.33],
];

let hat_colors: Array<[number, number, number]> = [[0, 0, 0], [1, 1, 1], [0.53, 0, 0], [1, 0, 0]];

let extra_colors: Array<[number, number, number]> = [[0, 0, 0], [1, 1, 1], [1, 1, 0], [1, 0, 0]];

function create_custom_palette(colors: CustomColors) {
    let new_palette = palette.slice();
    if (colors.shirt) {
        new_palette.splice(0, 3, ...colors.shirt);
    }

    if (colors.pants) {
        new_palette.splice(3, 3, ...colors.pants);
    }

    if (colors.hat) {
        new_palette.splice(6, 3, ...colors.hat);
    }

    if (colors.extra) {
        new_palette.splice(9, 3, ...colors.extra);
    }

    return new_palette;
}

export function get_hat(game: Game, palette: Array<number>): Blueprint {
    let hat_index = hat_models[~~(Math.random() * hat_models.length)];
    let body_height = game.models[BODY].size[1];
    let hat_height = game.models[hat_index].size[1];

    return {
        translation: [0, hat_height / 2 + body_height / 2, 0],
        rotation: [0, 1, 0, 0],
        using: [(game: Game) => render_vox(game.models[hat_index], palette)(game)],
    };
}

export function get_character_blueprint(game: Game): Blueprint {
    let shirt_color = shirt_colors[~~(Math.random() * shirt_colors.length)];
    let pants_color = pants_colors[~~(Math.random() * pants_colors.length)];
    let hat_color = hat_colors[~~(Math.random() * hat_colors.length)];
    let extra_color = extra_colors[~~(Math.random() * extra_colors.length)];

    let palette = create_custom_palette({
        shirt: shirt_color,
        pants: pants_color,
        hat: hat_color,
        extra: extra_color,
    });

    return {
        rotation: [0, 1, 0, 0],
        scale: [0.2, 0.2, 0.2],
        children: [
            {
                //body
                using: [
                    (game: Game) => render_vox(game.models[BODY], palette)(game),
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
                children: [get_hat(game, palette)],
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
                        using: [(game: Game) => render_vox(game.models[HAND], palette)(game)],
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
                        using: [(game: Game) => render_vox(game.models[HAND], palette)(game)],
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
                        using: [(game: Game) => render_vox(game.models[FOOT], palette)(game)],
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
                        using: [(game: Game) => render_vox(game.models[FOOT], palette)(game)],
                    },
                ],
            },
        ],
    };
}
