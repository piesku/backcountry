import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Blueprint} from "./blu_common.js";
import {create_line} from "./blu_tools.js";

let palette = [0.6, 0.4, 0, 0.4, 0.2, 0];
export function get_building_blueprint(game: Game) {
    let building_size = [
        20, // + ~~(Math.random() * 12),
        30, // + ~~(Math.random() * 12),
        15 + ~~(Math.random() * 5), // height
        // 15, // height
    ];
    let porch_size = 7 + ~~(Math.random() * 3);

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
            1
        ),
        ...create_line([0, 0, building_size[1]], [building_size[0] + 2, 0, building_size[1]], 1)
    );

    // PORCH
    for (let i = 0; i < porch_size; i++) {
        offsets.push(
            ...create_line(
                [building_size[0] + 2 + i, 0, 1],
                [building_size[0] + 2 + i, 0, building_size[1] + 1],
                1
            )
        );
    }

    // ROOF PORCH
    for (let i = 0; i < porch_size; i++) {
        offsets.push(
            ...create_line(
                [building_size[0] + i + 1, building_size[2] * 0.75, 0],
                [building_size[0] + i + 1, building_size[2] * 0.75, building_size[1] + 1],
                1
            )
        );
    }

    // Pillars
    offsets.push(
        ...create_line(
            [building_size[0] + porch_size, 0, 1],
            [building_size[0] + porch_size, building_size[2] * 0.75, 1],
            1
        ),
        ...create_line(
            [building_size[0] + porch_size, 0, building_size[1]],
            [building_size[0] + porch_size, building_size[2] * 0.75, building_size[1]],
            1
        )
    );

    // FENCE
    let fence_width = ~~(building_size[1] * 0.75) + 1;
    let fence_height = ~~(building_size[2] * 0.25);
    offsets.push(
        ...create_line(
            [building_size[0] + porch_size, fence_height, 1],
            [building_size[0] + porch_size, fence_height, fence_width],
            1
        )
    );

    for (let i = 1; i < fence_width; i += 2) {
        offsets.push(
            ...create_line(
                [building_size[0] + porch_size, 0, i],
                [building_size[0] + porch_size, fence_height + 2, i],
                1
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