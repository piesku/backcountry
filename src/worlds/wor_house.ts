import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {BuildingColors, main_building_palette} from "../blueprints/blu_building.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {create_line} from "../blueprints/blu_common.js";
import {get_house_tile_blueprint} from "../blueprints/blu_house_tile.js";
import {collide} from "../components/com_collide.js";
import {player_control} from "../components/com_control_player.js";
import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {named} from "../components/com_named.js";
import {find_navigable} from "../components/com_navigable.js";
import {path_find} from "../components/com_path_find.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {render_vox} from "../components/com_render_vox.js";
import {trigger_world} from "../components/com_trigger.js";
import {walking} from "../components/com_walking.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, set_seed} from "../math/random.js";
import {Models} from "../models_map.js";

let map_size = 5;

export function world_house(game: Game) {
    game.World = [];
    game.Grid = [];

    game.GL.clearColor(1, 0.3, 0.3, 1);

    let wall_offsets = [];
    let wall_height = 20;

    // Ground.
    for (let x = 0; x < map_size; x++) {
        game.Grid[x] = [];
        for (let y = 0; y < map_size; y++) {
            game.Grid[x][y] = Infinity;
            let tile_blueprint = get_house_tile_blueprint(game, x, y);

            game.Add({
                ...tile_blueprint,
                Translation: [(-(map_size / 2) + x) * 8, 0, (-(map_size / 2) + y) * 8],
            });
        }
    }
    game.Add({
        Translation: [16, 5, 5],
        Using: [collide(false, [8, 8, 8]), trigger_world("map")],
    });

    for (let x = -(map_size / 2) * 8; x < (map_size / 2) * 8; x++) {
        wall_offsets.push(
            ...create_line(
                [x, 2, 0],
                [x, wall_height, 0],
                x % 2 ? BuildingColors.light_wood : BuildingColors.wood
            )
        );
    }

    game.Add({
        Translation: [15.5, 5, 4.5],
        Scale: [1, 8, 6],
        Using: [
            render_vox(
                {
                    Offsets: Float32Array.from([0, 0, 0, BuildingColors.dark_wood]),
                    Size: [1, 1, 1],
                },
                main_building_palette
            ),
        ],
    });

    game.Add({
        Children: [
            {
                Translation: [-3, 0, -map_size * 4 - 3],
                Using: [
                    render_vox(
                        {
                            Size: [0, 0, 0],
                            Offsets: Float32Array.from(wall_offsets),
                        },
                        main_building_palette
                    ),
                ],
            },
            {
                Rotation: from_euler([], 0, 90, 0),
                Translation: [-map_size * 4 - 3, 0, -4],
                Using: [
                    render_vox(
                        {
                            Size: [0, 0, 0],
                            Offsets: Float32Array.from(wall_offsets),
                        },
                        main_building_palette
                    ),
                ],
            },
        ],
    });

    //window
    game.Add({
        Rotation: from_euler([], 0, integer(0, 2) * 180, 0),
        Translation: [-(map_size / 2) * 8 - 2.9, 10, -(map_size / 2 - 2) * 8],
        Using: [(game: Game) => render_vox(game.Models[Models.WINDOW])(game), cull(Get.Render)],
    });

    // Directional light
    game.Add({
        Translation: [1, 2, -1],
        Using: [light([0.5, 0.5, 0.5], 0)],
    });

    let player_position = game[Get.Transform][find_navigable(game, 3, 3)].Translation;

    // Player.
    set_seed(game.SeedPlayer);
    game.Add({
        Translation: [player_position[0], 5, player_position[2]],
        Rotation: from_euler([], 0, 270, 0),
        Using: [
            named("player"),
            player_control(),
            walking(Math.floor(map_size / 2), Math.floor(map_size / 2)),
            path_find(),
            move(25, 0),
            collide(true, [3, 7, 3]),
            ray_target(RayFlag.Player),
        ],
        Children: [
            get_character_blueprint(game),
            {
                Translation: [0, 25, 0],
                Using: [light([1, 1, 1], 20)],
            },
        ],
    });

    // Camera.
    game.Add(angle_camera_blueprint);

    // Sheriff.
    game.Add({
        Translation: [-12, 5, 12],
        Rotation: [0, 1, 0, 0],
        Using: [collide(false, [8, 8, 8]), trigger_world("wanted")],
        Children: [get_character_blueprint(game)],
    });
}
