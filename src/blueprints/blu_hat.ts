import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {integer, rand} from "../math/random.js";
import {Models} from "../models_map.js";
import {Blueprint, create_line} from "./blu_common.js";

// colors 2 & 5

export function get_hat_blueprint(game: Game, palette: number[]): Blueprint {
    let hat_z = integer(2, 4) * 2;
    let hat_x = integer(hat_z / 2, 5) * 2;
    let top_height = integer(1, 3);
    let top_width = 2; //integer(1, hat_z / 2 - 1) * 2;
    let has_extra = rand() > 0.2 && top_height > 1;
    let has_sides = rand() > 0.4;
    let has_far_sides = has_sides && rand() > 0.7;

    let body_height = game.Models[Models.BODY].Size[1];

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
        let modifier = has_far_sides ? 0.5 : -0.5;
        offsets.push(
            ...create_line(
                [hat_x / 2 + modifier, 1, -hat_z / 2 + 0.5],
                [hat_x / 2 + modifier, 1, hat_z / 2 + 0.5],
                2
            ),
            ...create_line(
                [-hat_x / 2 - modifier, 1, -hat_z / 2 + 0.5],
                [-hat_x / 2 - modifier, 1, hat_z / 2 + 0.5],
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
                    has_extra && y == 0 ? 5 : 2
                )
            );
        }
    }

    return {
        Translation: [0, body_height / 2 + 0.5, 0],
        // Do we need hats rotations?
        // Translation: is_rotated
        //     ? [0, body_height / 2 - 2, hat_height / 2 + 1]
        //     : [0, hat_height / 2 + body_height / 2, 0],
        // Rotation: is_rotated ? from_euler([], 90, 0, 0) : [0, 1, 0, 0],
        Children: [
            {
                Using: [
                    render_vox(
                        {
                            Offsets: Float32Array.from(offsets),
                            // TODO: Do we need this size anywhere?
                            // Size: [hat_x, top_height + 1 / 2, hat_z],
                            Size: [1, 1, 1],
                        },
                        palette
                    ),
                ],
            },
        ],
    };
}
