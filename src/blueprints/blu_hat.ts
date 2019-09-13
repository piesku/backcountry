import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {element, integer, rand} from "../math/random.js";
import {palette} from "../palette.js";
import {Blueprint, Color, create_line} from "./blu_common.js";

// colors 2 & 5
let hat_colors: Array<Color> = [[0.2, 0.2, 0.2], [0.9, 0.9, 0.9], [0.53, 0, 0], [1, 0, 0]];
let extra_colors: Array<Color> = [[0, 0, 0], [1, 1, 1], [1, 1, 0], [0.9, 0, 0]];

export function get_hat_blueprint(game: Game): Blueprint {
    let hat_palette = palette.slice();
    hat_palette.splice(6, 3, ...(element(hat_colors) as Color));
    hat_palette.splice(9, 3, ...(element(extra_colors) as Color));

    let hat_z = integer(2, 3) * 2;
    let hat_x = integer(Math.max(2, hat_z / 2), 5) * 2;
    let top_height = integer(1, 3);
    let top_width = 2; //integer(1, hat_z / 4) * 2;
    let has_extra = top_height > 1;
    let has_sides = rand() > 0.4;

    let offsets = [];

    for (let i = 0; i < hat_z; i++) {
        // BASE
        offsets.push(
            ...create_line(
                [-hat_x / 2 + 0.5, 0, -hat_z / 2 + i + 0.5],
                [hat_x / 2 + 0.5, 0, -hat_z / 2 + i + 0.5],
                2
            )
        );
    }

    if (has_sides) {
        // SIDES
        offsets.push(
            ...create_line(
                [hat_x / 2 - 0.5, 1, -hat_z / 2 + 0.5],
                [hat_x / 2 - 0.5, 1, hat_z / 2 + 0.5],
                2
            ),
            ...create_line(
                [-hat_x / 2 + 0.5, 1, -hat_z / 2 + 0.5],
                [-hat_x / 2 + 0.5, 1, hat_z / 2 + 0.5],
                2
            )
        );
    }

    // TOP
    for (let y = 0; y < top_height; y++) {
        for (let x = 0; x < top_width; x++) {
            offsets.push(
                ...create_line(
                    [-top_width / 2 + 0.5, y + 1, -top_width / 2 + x + 0.5],
                    [top_width / 2 + 0.5, y + 1, -top_width / 2 + x + 0.5],
                    has_extra && y == 0 ? 3 : 2
                )
            );
        }
    }

    return {
        Translation: [0, 3, 0],
        // Do we need hats rotations?
        // Translation: is_rotated
        //     ? [0, body_height / 2 - 2, hat_height / 2 + 1]
        //     : [0, hat_height / 2 + body_height / 2, 0],
        // Rotation: is_rotated ? from_euler([], 90, 0, 0) : [0, 1, 0, 0],
        Children: [
            {
                Using: [
                    render_vox(Float32Array.from(offsets), hat_palette),
                    animate({
                        [Anim.Idle]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                },
                            ],
                        },
                        [Anim.Hit]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Translation: [0, 0, 0],
                                },
                                {
                                    Timestamp: 0.1,
                                    Translation: [0, 2, 0],
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [0, 0, 0],
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                        [Anim.Select]: {
                            Keyframes: [
                                {
                                    Timestamp: 0,
                                    Translation: [0, 0, 0],
                                    Rotation: [0, 0, 0, 1],
                                },
                                {
                                    Timestamp: 0.1,
                                    Translation: [0, 2, 0],
                                    Rotation: [0, 1, 0, 0],
                                },
                                {
                                    Timestamp: 0.2,
                                    Translation: [0, 0, 0],
                                    Rotation: [0, 0, 0, -1],
                                },
                            ],
                            Flags: AnimationFlag.None,
                        },
                    }),
                ],
            },
        ],
    };
}
