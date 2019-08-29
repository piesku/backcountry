import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {BuildingColors, main_building_palette} from "./blu_building.js";
import {Blueprint} from "./blu_common.js";
import {create_line} from "./blu_tools.js";

export function get_town_gate_blueprint(
    game: Game,
    map_size: number,
    height: number,
    gate_size: number,
    fence_line: number,
    open: boolean
): Blueprint {
    //fence
    let fence_width = (map_size * 8 - gate_size) / 2;
    // TODO: Move to blueprint
    let fence_offsets = [
        ...create_line(
            [4, height, -map_size * 4],
            [4, height, -map_size * 4 + fence_width],
            BuildingColors.wood
        ),
        ...create_line(
            [4, height, -map_size * 4 + fence_width + gate_size],
            [4, height, map_size * 4],
            BuildingColors.wood
        ),
    ];

    // gate
    fence_offsets.push(
        ...create_line(
            [4, 0, -map_size * 4 + fence_width],
            [4, 20, -map_size * 4 + fence_width],
            BuildingColors.wood
        ),
        ...create_line(
            [4, 0, -map_size * 4 + fence_width + gate_size],
            [4, 20, -map_size * 4 + fence_width + gate_size],
            BuildingColors.wood
        ),
        ...create_line(
            [4, 20, -map_size * 4 + fence_width],
            [4, 20, -map_size * 4 + fence_width + gate_size + 1],
            BuildingColors.wood
        )
    );

    if (!open) {
        fence_offsets.push(
            ...create_line(
                [4, height, -map_size * 4 + fence_width],
                [4, height, -map_size * 4 + fence_width + gate_size],
                BuildingColors.wood
            )
        );
    } else {
        for (let i = 0; i < gate_size / 8; i++) {
            game.grid[fence_line][fence_width / 8 + i] = Infinity;
        }
    }

    for (let i = -(map_size / 2) * 8; i < (map_size / 2) * 8; i += 6) {
        if (i < -map_size * 4 + fence_width || i > -map_size * 4 + fence_width + gate_size) {
            fence_offsets.push(...create_line([4, 0, i], [4, height + 2, i], BuildingColors.wood));
        }
    }

    return {
        translation: [(-(map_size / 2) + fence_line) * 8 - 4, 0, -3],
        using: [
            render_vox(
                {offsets: Float32Array.from(fence_offsets), size: [1, 1, 1]},
                main_building_palette
            ),
        ],
    };
}
