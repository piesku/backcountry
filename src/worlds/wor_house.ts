import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_house_tile_blueprint} from "../blueprints/blu_house_tile.js";
import {audio_source} from "../components/com_audio_source.js";
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
import {shoot} from "../components/com_shoot.js";
import {trigger_world} from "../components/com_trigger.js";
import {walking} from "../components/com_walking.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, set_seed} from "../math/random.js";
import {Models} from "../models_map.js";

let map_size = 5;

export function world_house(game: Game) {
    game.world = [];
    game.grid = [];

    game.gl.clearColor(1, 0.3, 0.3, 1);

    let wall_offsets = [];
    let wall_height = 20;

    // Ground.
    for (let x = 0; x < map_size; x++) {
        game.grid[x] = [];
        for (let y = 0; y < map_size; y++) {
            game.grid[x][y] = Infinity;
            let tile_blueprint = get_house_tile_blueprint(game, x, y);
            game.add({
                ...tile_blueprint,
                translation: [(-(map_size / 2) + x) * 8, 0, (-(map_size / 2) + y) * 8],
            });
        }
    }

    // for (let x = -(map_size / 2) * 8; x < (map_size / 2) * 8; x++) {
    //     wall_offsets.push(
    //         ...create_line(
    //             [x, 2, 0],
    //             [x, wall_height, 0],
    //             x % 2 ? BuildingColors.light_wood : BuildingColors.wood
    //         )
    //     );
    // }

    // game.add({
    //     children: [
    //         {
    //             translation: [-3, 0, -map_size * 4 - 3],
    //             using: [
    //                 render_vox(
    //                     {
    //                         size: [0, 0, 0],
    //                         offsets: Float32Array.from(wall_offsets),
    //                     },
    //                     main_building_palette
    //                 ),
    //             ],
    //         },
    //         {
    //             rotation: from_euler([], 0, 90, 0),
    //             translation: [-map_size * 4 - 3, 0, -4],
    //             using: [
    //                 render_vox(
    //                     {
    //                         size: [0, 0, 0],
    //                         offsets: Float32Array.from(wall_offsets),
    //                     },
    //                     main_building_palette
    //                 ),
    //             ],
    //         },
    //     ],
    // });

    //window
    game.add({
        rotation: from_euler([], 0, integer(0, 2) * 180, 0),
        translation: [(map_size / 2) * 8 - 2.9, 10, -(map_size / 2 - 2) * 8],
        using: [(game: Game) => render_vox(game.models[Models.WINDOW])(game), cull(Get.Render)],
    });

    game.add({
        translation: [5, 5, 5],
        using: [collide(false, [8, 8, 8]), trigger_world("map", game.seed_town)],
    });

    // Directional light
    game.add({
        translation: [1, 2, -1],
        using: [light([0.5, 0.5, 0.5], 0)],
    });

    let player_position =
        game[Get.Transform][
            find_navigable(game, Math.floor(map_size / 2), Math.floor(map_size / 2))
        ].translation;
    // Player.
    set_seed(game.seed_player);
    game.add({
        translation: [player_position[0], 5, player_position[2]],
        using: [
            named("player"),
            player_control(),
            walking(Math.floor(map_size / 2), Math.floor(map_size / 2)),
            path_find(),
            move(25, 0),
            collide(true, [4, 7, 1]),
            ray_target(RayFlag.None),
            shoot(1),
            audio_source(),
        ],
        children: [
            get_character_blueprint(game),
            {
                translation: [0, 25, 0],
                using: [light([1, 1, 1], 20)],
            },
        ],
    });

    // Camera.
    game.add(angle_camera_blueprint);

    // Sheriff.
    game.add({
        translation: [-12, 5, 12],
        rotation: [0, 1, 0, 0],
        using: [collide(true, [8, 8, 8]), trigger_world("wanted", Math.random())],
        children: [get_character_blueprint(game)],
    });
}
