import {Action} from "../actions.js";
import {collide} from "../components/com_collide.js";
import {render_vox} from "../components/com_render_vox.js";
import {trigger} from "../components/com_trigger.js";
import {Game} from "../game.js";
import {BuildingColors, main_building_palette} from "./blu_building.js";
import {Blueprint, create_line} from "./blu_common.js";
import {get_rock_blueprint} from "./blu_rock.js";

export function get_mine_entrance_blueprint(game: Game) {
    let wooden_part_length = 26;
    let half_entrrance_width = 6;
    let half_entrance_height = 14;

    let wooden_part_offset = [
        ...create_line([-2, 2, 0], [-2, 2, wooden_part_length * 2], BuildingColors.tracks),
        ...create_line([2, 2, 0], [2, 2, wooden_part_length * 2], BuildingColors.tracks),
    ];

    for (let i = 0; i < wooden_part_length; i++) {
        wooden_part_offset.push(
            ...create_line(
                [-half_entrrance_width, 0, i],
                [-half_entrrance_width, half_entrance_height, i],
                i % 2 ? BuildingColors.wood : BuildingColors.light_wood
            ),
            ...create_line(
                [half_entrrance_width, 0, i],
                [half_entrrance_width, half_entrance_height, i],
                i % 2 ? BuildingColors.wood : BuildingColors.light_wood
            ),
            ...create_line(
                [-half_entrrance_width, half_entrance_height, i],
                [half_entrrance_width, half_entrance_height, i],
                i % 2 ? BuildingColors.light_wood : BuildingColors.wood
            )
        );
    }

    // tracks
    for (let i = 0; i < wooden_part_length * 2; i += 2) {
        wooden_part_offset.push(...create_line([-4, 1, i], [4, 1, i], BuildingColors.light_wood));
    }

    return <Blueprint>{
        Children: [
            {
                // The mountain.
                ...get_rock_blueprint(game),
                Scale: [4, 4, 4],
            },
            {
                // The wooden part.
                Translation: [4, 0, 0],
                Using: [
                    render_vox(
                        {
                            Offsets: Float32Array.from(wooden_part_offset),
                        },
                        main_building_palette
                    ),
                ],
            },
            {
                // The trigger.
                Translation: [0, 0, 18],
                Using: [collide(false, [8, 8, 8]), trigger(Action.GoToMine)],
            },
        ],
    };
}
