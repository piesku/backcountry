import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {element, integer, rand} from "../math/random.js";
import {Models} from "../models_map.js";
import {Blueprint, create_line} from "./blu_common.js";

export let main_building_palette = [
    0.6,
    0.4,
    0,
    0.4,
    0.2,
    0,
    0.14,
    0,
    0,
    0.2,
    0.8,
    1,
    0.53,
    0.53,
    0.53,
];

let additional_colors = [
    [0.87, 0.87, 0.87, 0.73, 0.73, 0.73],
    [0, 0.47, 0, 0, 0.33, 0],
    [0.67, 0, 0, 0.54, 0, 0],
];

export const enum BuildingColors {
    light_wood,
    wood,
    dark_wood,
    windows,
    tracks,
    color_1,
    color_2,
}

export function get_building_blueprint(game: Game) {
    let palette = [...main_building_palette, ...(element(additional_colors) as number[])];

    let has_tall_front_facade = rand() > 0.3;
    let has_windows = rand() > 0.2;
    let has_pillars = rand() > 0.4;
    let has_fence = rand() > 0.2;
    let is_painted = rand() > 0.4;
    let building_size_x = 20 + integer() * 8;
    let building_size_z = 30 + integer(0, 5) * 8;
    let building_size_y = 15 + integer(0, 9); // height
    let porch_size = 8; //7 + integer(0, 2);

    let offsets: number[] = [];
    let Children: Array<Blueprint> = [];

    // WALLS
    for (let x = 1; x < building_size_x; x++) {
        offsets.push(
            ...create_line(
                [x, 0, building_size_z - 1],
                [x, building_size_y, building_size_z - 1],
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

    for (let y = 1; y < building_size_z; y++) {
        offsets.push(
            ...create_line(
                [building_size_x, 0, y],
                [building_size_x, building_size_y * (has_tall_front_facade ? 1.5 : 1), y],
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
    for (let i = -1; i < building_size_x + 3 + porch_size; i++) {
        offsets.push(
            ...create_line([i - 1, 0, 0], [i - 1, 0, building_size_z + 2], BuildingColors.wood)
        );
    }

    if (has_windows && has_tall_front_facade) {
        // WINDOWS
        let window_width = game.Models[Models.WINDOW].Size![2];
        let window_height = game.Models[Models.WINDOW].Size![1];

        for (
            let offset = window_width;
            offset < building_size_z - window_width - 1;
            offset += window_width * 3
        ) {
            Children.push({
                Rotation: from_euler([], 0, integer(0, 2) * 180, 0),
                Translation: [
                    building_size_x + 1,
                    building_size_y + window_height / 2,
                    building_size_z - offset - window_width / 2,
                ],
                Using: [render_vox(game.Models[Models.WINDOW]), cull(Get.Render)],
            });
        }
    } else {
        // BANNER
        let banner_height = 5 + integer(0, 2);
        let bannner_width = ~~(building_size_z * 0.75 + rand() * building_size_z * 0.2);
        let banner_offset = ~~((building_size_z - bannner_width) / 2);
        for (let x = 2; x < bannner_width; x++) {
            for (let y = 0; y < banner_height; y++) {
                offsets.push(
                    building_size_x + 1,
                    ~~(building_size_y * (has_tall_front_facade ? 1.5 : 1)) +
                        y -
                        ~~(banner_height / 2),
                    banner_offset + x,
                    rand() > 0.3 || // 1/3 chance, but only when not on a border
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
                [building_size_x + i + 1, building_size_y * 0.75, 1],
                [building_size_x + i + 1, building_size_y * 0.75, building_size_z + 1],
                BuildingColors.wood
            )
        );
    }

    // Pillars
    has_pillars &&
        offsets.push(
            ...create_line(
                [building_size_x + porch_size, 0, 1],
                [building_size_x + porch_size, building_size_y * 0.75, 1],
                BuildingColors.wood
            ),
            ...create_line(
                [building_size_x + porch_size, 0, building_size_z],
                [building_size_x + porch_size, building_size_y * 0.75, building_size_z],
                BuildingColors.wood
            )
        );

    // FENCE
    if (has_fence) {
        let fence_width = ~~(building_size_z * 0.75) + 1;
        let fence_height = ~~(building_size_y * 0.25);
        offsets.push(
            ...create_line(
                [building_size_x + porch_size, fence_height, 1],
                [building_size_x + porch_size, fence_height, fence_width],
                BuildingColors.wood
            )
        );

        for (let i = 1; i < fence_width; i += 2) {
            offsets.push(
                ...create_line(
                    [building_size_x + porch_size, 0, i],
                    [building_size_x + porch_size, fence_height + 2, i],
                    BuildingColors.wood
                )
            );
        }

        // SIDE FENCES
        offsets.push(
            ...create_line(
                [building_size_x, fence_height, 1],
                [building_size_x + porch_size, fence_height, 1],
                BuildingColors.wood
            ),
            ...create_line(
                [building_size_x + porch_size, fence_height, building_size_z],
                [building_size_x, fence_height, building_size_z],
                BuildingColors.wood
            )
        );

        for (let i = 3; i < porch_size; i += 2) {
            offsets.push(
                ...create_line(
                    [building_size_x + i, 0, 1],
                    [building_size_x + i, fence_height + 2, 1],
                    BuildingColors.wood
                ),
                ...create_line(
                    [building_size_x + i, 0, building_size_z],
                    [building_size_x + i, fence_height + 2, building_size_z],
                    BuildingColors.wood
                )
            );
        }
    }

    // ROOF
    for (let y = 1; y < building_size_z; y++) {
        offsets.push(
            ...create_line([0, building_size_y, y], [building_size_x + 1, building_size_y, y], 1)
        );
    }

    // DOOR
    let door_height = building_size_y * 0.65;
    let door_width = 8;
    for (let i = 0; i < door_width; i++) {
        offsets.push(
            ...create_line(
                [building_size_x + 1, 0, building_size_z - i - 8],
                [building_size_x + 1, door_height, building_size_z - i - 8],
                BuildingColors.wood
            )
        );
    }

    let Size: [number, number, number] = [
        building_size_x + 3 + porch_size + 1,
        building_size_y,
        building_size_z + 2,
    ];

    return {
        Blueprint: <Blueprint>{
            Translation: [0, 1.5, 0],
            // rotation: from_euler([], 0, 270, 0),
            Using: [
                render_vox(
                    {
                        Offsets: Float32Array.from(offsets),
                    },
                    palette
                ),
            ],
            Children,
        },
        Size,
    };
}
