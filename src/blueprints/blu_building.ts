import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Blueprint} from "./blu_common.js";
import {create_line} from "./blu_tools.js";

let main_palette = [0.6, 0.4, 0, 0.4, 0.2, 0, 0.14, 0, 0, 0.2, 0.8, 1];

let additional_colors = [
    [0.87, 0.87, 0.87, 0.73, 0.73, 0.73],
    [0, 0.47, 0, 0, 0.33, 0],
    [0.67, 0, 0, 0.54, 0, 0],
];

const enum BuildingColors {
    light_wood = 0,
    wood = 1,
    dark_wood = 2,
    windows = 3,
    color_1 = 4,
    color_2 = 5,
}

export function get_building_blueprint(game: Game) {
    let palette = [
        ...main_palette,
        ...additional_colors[~~(Math.random() * additional_colors.length)],
    ];

    let has_tall_front_facade = Math.random() > 0.3;
    let has_windows = Math.random() > 0.4;
    let has_pillars = Math.random() > 0.4;
    let has_fence = Math.random() > 0.2;
    let is_painted = Math.random() > 0.4;
    let building_size = [
        20, // + ~~(Math.random() * 12),
        30, // + ~~(Math.random() * 5),
        15 + ~~(Math.random() * 10), // height
    ];
    let porch_size = 7 + ~~(Math.random() * 3);

    let offsets: number[] = [];

    // WALLS
    for (let x = 1; x < building_size[0]; x++) {
        offsets.push(
            ...create_line(
                [x, 0, building_size[1] - 1],
                [x, building_size[2], building_size[1] - 1],
                is_painted
                    ? x % 2
                        ? BuildingColors.color_1
                        : BuildingColors.color_2
                    : x % 2
                    ? BuildingColors.light_wood
                    : BuildingColors.wood
            )
        );
    }

    for (let y = 1; y < building_size[1]; y++) {
        offsets.push(
            ...create_line(
                [building_size[0], 0, y],
                [building_size[0], building_size[2] * (has_tall_front_facade ? 1.5 : 1), y],
                is_painted
                    ? y % 2
                        ? BuildingColors.color_1
                        : BuildingColors.color_2
                    : y % 2
                    ? BuildingColors.light_wood
                    : BuildingColors.wood
            )
        );
    }

    // PORCH + FLOOR
    for (let i = -1; i < building_size[0] + 3 + porch_size; i++) {
        offsets.push(
            ...create_line([i - 1, 0, 0], [i - 1, 0, building_size[1] + 2], BuildingColors.wood)
        );
    }

    if (has_windows && has_tall_front_facade) {
        // WINDOWS
        let window_width = Math.round(building_size[0] / 4);
        let window_height = ~~(building_size[2] * 0.4) + 1;

        for (
            let offset = window_width;
            offset < building_size[1] - window_width - 1;
            offset += window_width * 3
        ) {
            offsets.push(
                ...create_line(
                    [building_size[0] + 1, building_size[2], building_size[1] - offset],
                    [
                        building_size[0] + 1,
                        building_size[2] + window_height,
                        building_size[1] - offset,
                    ],
                    BuildingColors.wood
                ),
                ...create_line(
                    [
                        building_size[0] + 1,
                        building_size[2],
                        building_size[1] - offset - window_width,
                    ],
                    [
                        building_size[0] + 1,
                        building_size[2] + window_height,
                        building_size[1] - offset - window_width,
                    ],
                    BuildingColors.wood
                )
            );

            for (let i = 0; i < window_height; i++) {
                offsets.push(
                    ...create_line(
                        [building_size[0] + 1, building_size[2] + i, building_size[1] - offset - 1],
                        [
                            building_size[0] + 1,
                            building_size[2] + i,
                            building_size[1] - offset - window_width - 1,
                        ],
                        i === 0 || i === window_height - 1
                            ? BuildingColors.wood
                            : BuildingColors.windows
                    )
                );
            }

            offsets.push(
                ...create_line(
                    [building_size[0] + 2, building_size[2], building_size[1] - offset],
                    [
                        building_size[0] + 2,
                        building_size[2],
                        building_size[1] - offset - window_width - 1,
                    ],
                    BuildingColors.wood
                )
            );
        }
    } else {
        // BANNER
        let banner_height = 5 + ~~(Math.random() * 3);
        let bannner_width = ~~(building_size[1] * 0.75 + Math.random() * building_size[1] * 0.2);
        let banner_offset = ~~((building_size[1] - bannner_width) / 2);
        for (let x = 2; x < bannner_width; x++) {
            for (let y = 0; y < banner_height; y++) {
                offsets.push(
                    building_size[0] + 1,
                    ~~(building_size[2] * (has_tall_front_facade ? 1.5 : 1)) +
                        y -
                        ~~(banner_height / 2),
                    banner_offset + x,
                    Math.random() > 0.3 || // 1/3 chance, but only when not on a border
                        x == 2 ||
                        x == bannner_width - 1 ||
                        y == 0 ||
                        y == banner_height - 1
                        ? BuildingColors.wood
                        : BuildingColors.dark_wood
                );
            }
        }
    }

    // PORCH ROOF
    for (let i = 0; i < porch_size; i++) {
        offsets.push(
            ...create_line(
                [building_size[0] + i + 1, building_size[2] * 0.75, 1],
                [building_size[0] + i + 1, building_size[2] * 0.75, building_size[1] + 1],
                BuildingColors.wood
            )
        );
    }

    // Pillars
    has_pillars &&
        offsets.push(
            ...create_line(
                [building_size[0] + porch_size, 0, 1],
                [building_size[0] + porch_size, building_size[2] * 0.75, 1],
                BuildingColors.wood
            ),
            ...create_line(
                [building_size[0] + porch_size, 0, building_size[1]],
                [building_size[0] + porch_size, building_size[2] * 0.75, building_size[1]],
                BuildingColors.wood
            )
        );

    // FENCE
    if (has_fence) {
        let fence_width = ~~(building_size[1] * 0.75) + 1;
        let fence_height = ~~(building_size[2] * 0.25);
        offsets.push(
            ...create_line(
                [building_size[0] + porch_size, fence_height, 1],
                [building_size[0] + porch_size, fence_height, fence_width],
                BuildingColors.wood
            )
        );

        for (let i = 1; i < fence_width; i += 2) {
            offsets.push(
                ...create_line(
                    [building_size[0] + porch_size, 0, i],
                    [building_size[0] + porch_size, fence_height + 2, i],
                    BuildingColors.wood
                )
            );
        }

        // SIDE FENCES
        offsets.push(
            ...create_line(
                [building_size[0], fence_height, 1],
                [building_size[0] + porch_size, fence_height, 1],
                BuildingColors.wood
            ),
            ...create_line(
                [building_size[0] + porch_size, fence_height, building_size[1]],
                [building_size[0], fence_height, building_size[1]],
                BuildingColors.wood
            )
        );

        for (let i = 3; i < porch_size; i += 2) {
            offsets.push(
                ...create_line(
                    [building_size[0] + i, 0, 1],
                    [building_size[0] + i, fence_height + 2, 1],
                    BuildingColors.wood
                ),
                ...create_line(
                    [building_size[0] + i, 0, building_size[1]],
                    [building_size[0] + i, fence_height + 2, building_size[1]],
                    BuildingColors.wood
                )
            );
        }
    }

    // ROOF
    for (let y = 1; y < building_size[1]; y++) {
        offsets.push(
            ...create_line([0, building_size[2], y], [building_size[0] + 1, building_size[2], y], 1)
        );
    }

    // DOOR
    let door_height = building_size[2] * 0.65;
    let door_width = building_size[1] * 0.2;
    for (let i = 0; i < door_width; i++) {
        offsets.push(
            ...create_line(
                [building_size[0] + 1, 0, building_size[1] - i - 3],
                [building_size[0] + 1, door_height, building_size[1] - i - 3],
                BuildingColors.wood
            )
        );
    }

    return {
        translation: [0, 1.5, 0],
        // rotation: from_euler([], 0, 270, 0),
        using: [
            render_vox(
                {
                    offsets: Float32Array.from(offsets),
                    size: [
                        building_size[0] + 3 + porch_size + 1,
                        building_size[2],
                        building_size[1] + 2,
                    ],
                },
                palette
            ),
        ],
    } as Blueprint;
}
