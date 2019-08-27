import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Blueprint} from "./blu_common.js";
import {create_line} from "./blu_tools.js";

let palette = [0.6, 0.4, 0, 0.4, 0.2, 0];
export function get_building_blueprint(game: Game) {
    let building_size = [
        20 + ~~(Math.random() * 12),
        20 + ~~(Math.random() * 12),
        // 15 + ~~(Math.random() * 12), // height
        15, // height
    ];
    let porch_size = 5 + ~~(Math.random() * 3);

    let offsets: number[] = [];

    // WALLS
    for (let x = 1; x < building_size[0]; x++) {
        offsets
            // .concat(create_line([x, 0, 0], [x, building_size[2], 0], x % 2))
            .push(
                ...create_line(
                    [x, 0, building_size[1] - 1],
                    [x, building_size[2], building_size[1] - 1],
                    x % 2
                )
            );
    }

    for (let y = 1; y < building_size[1]; y++) {
        offsets
            // .concat(create_line([0, 0, y], [0, building_size[2], y], y % 2))
            .push(
                ...create_line(
                    [building_size[0], 0, y],
                    [building_size[0], building_size[2] * 1.5, y],
                    y % 2
                )
            );
    }

    // BASE
    offsets.push(
        ...create_line(
            [building_size[0] + 2, 0, 1],
            [building_size[0] + 2, 0, building_size[1] + 1],
            0
        ),
        ...create_line([0, 0, building_size[1]], [building_size[0] + 2, 0, building_size[1]], 0)
    );

    // PORCH
    for (let i = 0; i < porch_size; i++) {
        offsets.push(
            ...create_line(
                [building_size[0] + 2 + i, 0, 1],
                [building_size[0] + 2 + i, 0, building_size[1] + 1],
                0
            )
        );
    }

    // PORCH
    for (let i = 0; i < porch_size; i++) {
        offsets.push(
            ...create_line(
                [building_size[0] + 1 + i, building_size[2] * 0.75, 1],
                [building_size[0] + 1 + i, building_size[2] * 0.75, building_size[1] + 1],
                0
            )
        );
    }

    // ROOF
    for (let y = 1; y < building_size[1]; y++) {
        offsets.push(
            ...create_line([0, building_size[2], y], [building_size[0], building_size[2], y], 1)
        );
    }

    return {
        translation: [0, 1.5, 0],
        using: [
            render_vox(
                {
                    offsets: Float32Array.from(offsets),
                    size: [1, 1, 1],
                },
                palette
            ),
        ],
    } as Blueprint;
}
