import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {get_mine_wall_blueprint} from "../blueprints/blu_mine_wall.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {player_control} from "../components/com_control_player.js";
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

export function world_mine(game: Game) {
    set_seed(game.seed_bounty);

    game.world = [];
    game.grid = [];

    game.gl.clearColor(1, 0.3, 0.3, 1);

    let map_size = 15;
    for (let x = 0; x < map_size; x++) {
        game.grid[x] = [];
        for (let y = 0; y < map_size; y++) {
            if (x == 0 || x == map_size - 1 || y == 0 || y == map_size - 1) {
                game.grid[x][y] = NaN;
            } else {
                game.grid[x][y] = Infinity;
            }
        }
    }

    generate_maze(game, [0, map_size - 1], [0, map_size - 1], map_size);

    let palette = [0.2, 0.2, 0.2, 0.5, 0.5, 0.5];
    // Ground.
    for (let x = 0; x < map_size; x++) {
        for (let y = 0; y < map_size; y++) {
            let is_walkable = game.grid[x][y] == Infinity;
            // let is_walkable = true; // rand() > 0.04;
            let tile_blueprint = is_walkable
                ? get_tile_blueprint(game, is_walkable, x, y, palette)
                : get_mine_wall_blueprint(palette);

            game.add({
                ...tile_blueprint,
                translation: [
                    (-(map_size / 2) + x) * 8,
                    tile_blueprint.translation![1],
                    (-(map_size / 2) + y) * 8,
                ],
            });
        }
    }

    // Directional light and Soundtrack
    game.add({
        translation: [1, 2, -1],
        using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_music)],
    });

    // Cowboys.
    let cowboys_count = 15;
    for (let i = 0; i < cowboys_count; i++) {
        let x = integer(0, map_size);
        let y = integer(0, map_size);
        if (game.grid[x] && game.grid[x][y] && !isNaN(game.grid[x][y])) {
            game.add({
                translation: [(-(map_size / 2) + x) * 8, 5, (-(map_size / 2) + y) * 8],
                rotation: from_euler([], 0, integer(0, 3) * 90, 0),
                using: [npc(), path_find(), walking(x, y, false), move(integer(15, 25), 0)],
                children: [get_character_blueprint(game)],
            });
        }
    }

    let player_position = game[Get.Transform][find_navigable(game, 1, 1)].translation;
    // Player.
    set_seed(game.seed_player);
    game.add({
        translation: [player_position[0], 5, player_position[2]],
        using: [
            named("player"),
            player_control(),
            walking(1, 1, false),
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
}

function generate_maze(game: Game, [x1, x2]: number[], [y1, y2]: number[], size: number) {
    let width = x2 - x1;
    let height = y2 - y1;
    if (width >= height) {
        // vertical bisection
        if (x2 - x1 > 3) {
            let bisection = Math.ceil((x1 + x2) / 2);
            let max = y2 - 1;
            let min = y1 + 1;
            let randomPassage = integer(min, max);
            let first = false;
            let second = false;
            if (game.grid[y2][bisection] == Infinity) {
                randomPassage = max;
                first = true;
            }
            if (game.grid[y1][bisection] == Infinity) {
                randomPassage = min;
                second = true;
            }
            for (let i = y1 + 1; i < y2; i++) {
                if (first && second) {
                    if (i == max || i == min) {
                        continue;
                    }
                } else if (i == randomPassage) {
                    continue;
                }
                game.grid[i][bisection] = NaN;
            }
            generate_maze(game, [x1, bisection], [y1, y2], size);
            generate_maze(game, [bisection, x2], [y1, y2], size);
        }
    } else {
        // horizontal bisection
        if (y2 - y1 > 3) {
            let bisection = Math.ceil((y1 + y2) / 2);
            let max = x2 - 1;
            let min = x1 + 1;
            let randomPassage = integer(min, max);
            let first = false;
            let second = false;
            if (game.grid[bisection][x2] == Infinity) {
                randomPassage = max;
                first = true;
            }
            if (game.grid[bisection][x1] == Infinity) {
                randomPassage = min;
                second = true;
            }
            for (let i = x1 + 1; i < x2; i++) {
                if (first && second) {
                    if (i == max || i == min) {
                        continue;
                    }
                } else if (i == randomPassage) {
                    continue;
                }
                game.grid[bisection][i] = NaN;
            }
            generate_maze(game, [x1, x2], [y1, bisection], size);
            generate_maze(game, [x1, x2], [bisection, y2], size);
        }
    }
}
