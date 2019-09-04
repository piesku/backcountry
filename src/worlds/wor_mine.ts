import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {get_mine_wall_blueprint} from "../blueprints/blu_mine_wall.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {player_control} from "../components/com_control_player.js";
import {health} from "../components/com_health.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {named} from "../components/com_named.js";
import {find_navigable} from "../components/com_navigable.js";
import {npc} from "../components/com_npc.js";
import {path_find} from "../components/com_path_find.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {shoot} from "../components/com_shoot.js";
import {walking} from "../components/com_walking.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, set_seed} from "../math/random.js";
import {snd_music} from "../sounds/snd_music.js";
import {generate_maze} from "./wor_common.js";

export function world_mine(game: Game) {
    set_seed(game.SeedBounty);

    game.World = [];
    game.Grid = [];

    game.GL.clearColor(1, 0.3, 0.3, 1);

    let map_size = 10;
    for (let x = 0; x < map_size; x++) {
        game.Grid[x] = [];
        for (let y = 0; y < map_size; y++) {
            if (x == 0 || x == map_size - 1 || y == 0 || y == map_size - 1) {
                game.Grid[x][y] = NaN;
            } else {
                game.Grid[x][y] = Infinity;
            }
        }
    }

    generate_maze(game, [0, map_size - 1], [0, map_size - 1], map_size, 0.3);

    let palette = [0.2, 0.2, 0.2, 0.5, 0.5, 0.5];
    // Ground.
    for (let x = 0; x < map_size; x++) {
        for (let y = 0; y < map_size; y++) {
            let is_walkable = game.Grid[x][y] == Infinity;
            // let is_walkable = true; // rand() > 0.04;
            let tile_blueprint = is_walkable
                ? get_tile_blueprint(game, is_walkable, x, y, palette)
                : get_mine_wall_blueprint(palette);

            game.Add({
                ...tile_blueprint,
                Translation: [
                    (-(map_size / 2) + x) * 8,
                    tile_blueprint.Translation![1],
                    (-(map_size / 2) + y) * 8,
                ],
            });
        }
    }

    // Directional light and Soundtrack
    game.Add({
        Translation: [1, 2, -1],
        Using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_music)],
    });

    // Bandit.
    let x = integer(0, map_size);
    let y = integer(0, map_size);
    if (game.Grid[x] && game.Grid[x][y] && !isNaN(game.Grid[x][y])) {
        game.Add({
            Translation: [(-(map_size / 2) + x) * 8, 5, (-(map_size / 2) + y) * 8],
            Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
            Using: [
                npc(false, true),
                path_find(),
                walking(x, y, false),
                move(integer(8, 15), 0),
                collide(true, [7, 7, 7]),
                health(3),
                shoot(1),
                ray_target(RayFlag.Attackable),
            ],
            Children: [(set_seed(game.SeedBounty), get_character_blueprint(game))],
        });
    }

    let player_position = game[Get.Transform][find_navigable(game, 1, 1)].Translation;
    // Player.
    set_seed(game.SeedPlayer);
    game.Add({
        Translation: [player_position[0], 5, player_position[2]],
        Using: [
            named("player"),
            player_control(),
            walking(1, 1, false),
            path_find(),
            move(25, 0),
            collide(true, [3, 7, 3]),
            ray_target(RayFlag.Player),
            shoot(1),
            audio_source(),
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
}
