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

type Color = [number, number, number];

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

export function get_character_blueprint(game: Game): Blueprint {
    let character_palette = palette.slice();
    character_palette.splice(0, 3, ...(element(shirt_colors) as Color));
    character_palette.splice(3, 3, ...(element(pants_colors) as Color));
    character_palette.splice(6, 3, ...(element(hat_colors) as Color));
    character_palette.splice(9, 3, ...(element(extra_colors) as Color));
    character_palette.splice(12, 3, ...(element(skin_colors) as Color));
    character_palette.splice(15, 3, ...(element(hair_colors) as Color));

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
                            Translation: [0, 1, 0],
                            Rotation: [0, 1, 0, 0],
                        },
                        {
                            Timestamp: 1,
                            Translation: [0, -4, 0],
                            Rotation: from_euler([], -90, 0, 0),
                            Ease: ease_out_quart,
                        },
                        {
                            Timestamp: 4,
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
                    render_vox(game.Models[Models.BODY], character_palette),
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
                Children: [get_hat_blueprint(game, character_palette)],
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
                        Using: [render_vox(game.Models[Models.HAND], character_palette)],
                    },
                    create_gun(game),
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
                        Using: [render_vox(game.Models[Models.HAND], character_palette)],
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
                        Using: [render_vox(game.Models[Models.FOOT], character_palette)],
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
                        Using: [render_vox(game.Models[Models.FOOT], character_palette)],
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
