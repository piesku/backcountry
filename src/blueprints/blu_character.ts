import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {named} from "../components/com_named.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {ease_out_quart} from "../math/easing.js";
import {from_euler} from "../math/quat.js";
import {element} from "../math/random.js";
import {Models} from "../models_map.js";
import {palette} from "../palette.js";
import {Blueprint, Color} from "./blu_common.js";
import {create_gun} from "./blu_gun.js";
import {get_hat_blueprint} from "./blu_hat.js";

let shirt_colors: Array<Color> = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]];
let skin_colors: Array<Color> = [[1, 0.8, 0.6], [0.6, 0.4, 0]];
let hair_colors: Array<Color> = [[1, 1, 0], [0, 0, 0], [0.6, 0.4, 0], [0.4, 0, 0]];
let pants_colors: Array<Color> = [[0, 0, 0], [0.53, 0, 0], [0.6, 0.4, 0.2], [0.33, 0.33, 0.33]];

export function get_character_blueprint(game: Game): Blueprint {
    // Create the hat first so that the hat itself can be reproduced with SeedBounty.
    let hat = get_hat_blueprint(game);

    let character_palette = palette.slice();
    character_palette.splice(0, 3, ...(element(shirt_colors) as Color));
    character_palette.splice(3, 3, ...(element(pants_colors) as Color));
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
                            //Rotation: from_euler([], -90, 0, 0),
                            Rotation: [-0.7, 0, 0, 0.7],
                            Ease: ease_out_quart,
                        },
                        {
                            Timestamp: 5,
                            Translation: [0, -9, 0],
                        },
                    ],
                    Flags: AnimationFlag.None,
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
                                    //Rotation: from_euler([], 0, 5, 0),
                                    Rotation: [0, 0.04, 0, 0.99],
                                },
                                {
                                    Timestamp: 0.5,
                                    //Rotation: from_euler([], 0, -5, 0),
                                    Rotation: [0, -0.04, 0, 0.99],
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0.0,
                                    Rotation: from_euler([], 0, 5, 0),
                                    //Rotation: [0, 0.04, 0, 0.99],
                                },
                                {
                                    Timestamp: 0.2,
                                    //Rotation: from_euler([], 0, -5, 0),
                                    Rotation: [0, -0.04, 0, 0.99],
                                },
                            ],
                        },
                    }),
                ],
                Children: [hat],
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
                                    //Rotation: from_euler([], 5, 0, 0),
                                    Rotation: [0.04, 0, 0, 0.99],
                                },
                                {
                                    Timestamp: 0.5,
                                    //Rotation: from_euler([], -5, 0, 0),
                                    Rotation: [-0.04, 0, 0, 0.99],
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    //Rotation: from_euler([], 60, 0, 0),
                                    Rotation: [0.5, 0, 0, 0.87],
                                },
                                {
                                    Timestamp: 0.2,
                                    //Rotation: from_euler([], -30, 0, 0),
                                    Rotation: [-0.25, 0, 0, 0.97],
                                },
                            ],
                        },
                        [Anim.Shoot]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    //Rotation: from_euler([], 50, 0, 0),
                                    Rotation: [0.42, 0, 0, 0.9],
                                },
                                {
                                    Timestamp: 0.1,
                                    //Rotation: from_euler([], 90, 0, 0),
                                    Rotation: [0.7, 0, 0, 0.7],
                                    Ease: ease_out_quart,
                                },
                                {
                                    Timestamp: 0.13,
                                    //Rotation: from_euler([], 110, 0, 0),
                                    Rotation: [0.82, 0, 0, 0.57],
                                },
                                {
                                    Timestamp: 0.3,
                                    //Rotation: from_euler([], 0, 0, 0),
                                    Rotation: [0, 0, 0, 1],
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
                                    //Rotation: from_euler([], -5, 0, 0),
                                    Rotation: [-0.04, 0, 0, 0.99],
                                },
                                {
                                    Timestamp: 0.5,
                                    //Rotation: from_euler([], 5, 0, 0),
                                    Rotation: [0.04, 0, 0, 0.99],
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    //Rotation: from_euler([], -30, 0, 0),
                                    Rotation: [-0.25, 0, 0, 0.97],
                                },
                                {
                                    Timestamp: 0.2,
                                    //Rotation: from_euler([], 60, 0, 0),
                                    Rotation: [0.5, 0, 0, 0.87],
                                },
                            ],
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
                                    //Rotation: from_euler([], 5, 0, 0),
                                    Rotation: [0.04, 0, 0, 0.99],
                                },
                                {
                                    Timestamp: 1,
                                    //Rotation: from_euler([], 5, 0, 0),
                                    Rotation: [0.04, 0, 0, 0.99],
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    //Rotation: from_euler([], -45, 0, 0),
                                    Rotation: [-0.38, 0, 0, 0.92],
                                },
                                {
                                    Timestamp: 0.2,
                                    //Rotation: from_euler([], 45, 0, 0),
                                    Rotation: [0.38, 0, 0, 0.92],
                                },
                            ],
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
                                    //Rotation: from_euler([], -5, 0, 0),
                                    Rotation: [-0.04, 0, 0, 0.99],
                                },
                                {
                                    Timestamp: 1,
                                    //Rotation: from_euler([], -5, 0, 0),
                                    Rotation: [-0.04, 0, 0, 0.99],
                                },
                            ],
                        },
                        [Anim.Move]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    //Rotation: from_euler([], 45, 0, 0),
                                    Rotation: [0.38, 0, 0, 0.92],
                                },
                                {
                                    Timestamp: 0.2,
                                    //Rotation: from_euler([], -45, 0, 0),
                                    Rotation: [-0.38, 0, 0, 0.92],
                                },
                            ],
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
