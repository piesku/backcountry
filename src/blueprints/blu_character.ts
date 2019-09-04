import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {named} from "../components/com_named.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {ease_in_out_quart, ease_out_quart} from "../math/easing.js";
import {from_euler} from "../math/quat.js";
import {element} from "../math/random.js";
import {Models} from "../models_map.js";
import {palette} from "../palette.js";
import {Blueprint} from "./blu_common.js";
import {get_hat_blueprint} from "./blu_hat.js";
import {create_gun} from "./items/blu_gun.js";

// const enum CustomColorIndex {
//     Shirt = 0,
//     Pants = 1,
//     Hat = 2,
//     Extra = 3,
//     Skin = 4,
//     Hair = 5,
// }

type Color = [number, number, number];

interface CustomColors {
    Shirt?: Color;
    Pants?: Color;
    Hat?: Color;
    Extra?: Color;
    Skin?: Color;
    Hair?: Color;
}

let shirt_colors: Array<Color> = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]];
let hat_colors: Array<Color> = [[0.2, 0.2, 0.2], [0.9, 0.9, 0.9], [0.53, 0, 0], [1, 0, 0]];
let extra_colors: Array<Color> = [[0, 0, 0], [1, 1, 1], [1, 1, 0], [0.9, 0, 0]];
let skin_colors: Array<Color> = [[1, 0.8, 0.6], [1, 0.8, 0.6], [0.6, 0.4, 0]];
let hair_colors: Array<Color> = [[1, 1, 0], [0, 0, 0], [0.6, 0.4, 0], [0.4, 0, 0]];
let pants_colors: Array<Color> = [
    [0, 0, 0],
    [0.53, 0, 0],
    [0.53, 0, 0],
    [0.6, 0.4, 0.2],
    [0.33, 0.33, 0.33],
];

function create_custom_palette(colors: CustomColors) {
    let new_palette = palette.slice();
    if (colors.Shirt) {
        new_palette.splice(0, 3, ...colors.Shirt);
    }

    if (colors.Pants) {
        new_palette.splice(3, 3, ...colors.Pants);
    }

    if (colors.Hat) {
        new_palette.splice(6, 3, ...colors.Hat);
    }

    if (colors.Extra) {
        new_palette.splice(9, 3, ...colors.Extra);
    }

    if (colors.Skin) {
        new_palette.splice(12, 3, ...colors.Skin);
    }

    if (colors.Hair) {
        new_palette.splice(15, 3, ...colors.Hair);
    }

    return new_palette;
}

export function get_character_blueprint(game: Game): Blueprint {
    let shirt_color = element(shirt_colors) as Color;
    let pants_color = element(pants_colors) as Color;
    let hat_color = element(hat_colors) as Color;
    let extra_color = element(extra_colors) as Color;
    let skin_color = element(skin_colors) as Color;
    let hair_color = element(hair_colors) as Color;

    let palette = create_custom_palette({
        Shirt: shirt_color,
        Pants: pants_color,
        Hat: hat_color,
        Extra: extra_color,
        Skin: skin_color,
        Hair: hair_color,
    });

    let right_hand_item = create_gun(game);
    // let left_hand_item = rand() > 0.5 ? {} : (element(items) as Mixin)(game);

    return {
        Rotation: [0, 1, 0, 0],
        Using: [
            animate({
                [Anim.Idle]: {
                    Keyframes: [
                        {
                            Timestamp: 0,
                        },
                    ],
                },
                [Anim.Die]: {
                    Keyframes: [
                        {
                            Timestamp: 0,
                            Translation: [0, 0, 0],
                            Rotation: [0, 1, 0, 0],
                        },
                        {
                            Timestamp: 0.4,
                            Translation: [0, -4, 0],
                            Rotation: from_euler([], -90, 0, 0),
                        },
                        {
                            Timestamp: 5,
                            Translation: [0, -10, 0],
                        },
                    ],
                },
            }),
        ],
        Children: [
            {
                //body
                Using: [
                    render_vox(game.Models[Models.BODY], palette),
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Rotation: from_euler([], 0, 5, 0),
                                },
                                {
                                    Timestamp: 0.5,
                                    Rotation: from_euler([], 0, -5, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Rotation: from_euler([], 0, 5, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], 0, -5, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [0, 0, 0],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [0, 2, 0],
                                    Rotation: from_euler([], 15, 0, 0),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [0, 0, 0],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [get_hat_blueprint(game, palette)],
            },
            {
                // right arm
                Translation: [1.5, 0, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                                {
                                    Timestamp: 0.5,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 60, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], -30, 0, 0),
                                },
                            ],
                        },
                        [Anim.Shoot]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 50, 0, 0),
                                },
                                {
                                    Timestamp: 0.1,
                                    Rotation: from_euler([], 90, 0, 0),
                                    Ease: ease_out_quart,
                                },
                                {
                                    Timestamp: 0.13,
                                    Rotation: from_euler([], 110, 0, 0),
                                },
                                {
                                    Timestamp: 0.3,
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [1.5, 2, 0.5],
                                    Rotation: from_euler([], 0, 0, 135),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1, 0],
                        Using: [render_vox(game.Models[Models.HAND], palette)],
                    },
                    right_hand_item,
                ],
            },
            {
                // left arm
                Translation: [-1.5, 0, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                                {
                                    Timestamp: 0.5,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -30, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], 60, 0, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [-1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [-1.5, 2, 0.5],
                                    Rotation: from_euler([], 0, 0, -135),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [-1.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1, 0],
                        Using: [render_vox(game.Models[Models.HAND], palette)],
                    },
                    // left_hand_item,
                ],
            },
            {
                // right foot
                Translation: [0.5, -2, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                                {
                                    Timestamp: 1,
                                    Rotation: from_euler([], 5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -45, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], 45, 0, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [0.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, 45),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1.5, 0],
                        Using: [render_vox(game.Models[Models.FOOT], palette)],
                    },
                ],
            },
            {
                // left foot
                Translation: [-0.5, -2, 0.5],
                Using: [
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                                {
                                    Timestamp: 1,
                                    Rotation: from_euler([], -5, 0, 0),
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Rotation: from_euler([], 45, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Rotation: from_euler([], -45, 0, 0),
                                },
                            ],
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Translation: [-0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [-0.5, 0, 0.5],
                                    Rotation: from_euler([], 0, 0, -45),
                                    Ease: ease_in_out_quart,
                                },
                                {
                                    Timestamp: 0.4,
                                    Translation: [-0.5, -2, 0.5],
                                    Rotation: from_euler([], 0, 0, 0),
                                    Ease: ease_out_quart,
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
                Children: [
                    {
                        Translation: [0, -1.5, 0],
                        Using: [render_vox(game.Models[Models.FOOT], palette)],
                    },
                ],
            },
            {
                // Projectile spawn point.
                Translation: [1.5, 0, -5],
                Using: [named("proj")],
            },
        ],
    };
}
