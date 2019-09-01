import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {get_mine_entrance_blueprint} from "../blueprints/blu_mine_entrance.js";
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
import {integer, set_seed} from "../math/random.js";
import {snd_music} from "../sounds/snd_music.js";

export function world_desert(game: Game) {
    set_seed(game.SeedBounty);
    let map_size = 50;

    game.World = [];
    game.Grid = [];

    game.GL.clearColor(1, 0.3, 0.3, 1);

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

    generate_maze(game, [0, map_size - 1], [0, map_size - 1], map_size);

    // Ground.
    for (let x = 0; x < map_size; x++) {
        for (let y = 0; y < map_size; y++) {
            let is_walkable = game.Grid[x][y] == Infinity || Math.random() > 0.5;
            game.Grid[x][y] = is_walkable ? Infinity : NaN;

            let tile_blueprint = get_tile_blueprint(game, is_walkable, x, y);

            game.add({
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
    game.add({
        Translation: [1, 2, -1],
        Using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_music)],
    });

    // Cowboys.
    let cowboys_count = 5;
    for (let i = 0; i < cowboys_count; i++) {
        let x = integer(0, map_size);
        let y = integer(0, map_size);
        if (game.Grid[x] && game.Grid[x][y] && !isNaN(game.Grid[x][y])) {
            game.add({
                Translation: [(-(map_size / 2) + x) * 8, 5, (-(map_size / 2) + y) * 8],
                Using: [npc(), path_find(), walking(x, y, true), move(integer(15, 25), 0)],
                Children: [get_character_blueprint(game)],
            });
        }
    }

    let entrance = get_mine_entrance_blueprint(game);
    game.add({
        Translation: [(map_size / 2 - 15) * 8, 0, (map_size / 2 - 12) * 8],
        ...entrance,
    });

    set_seed(game.SeedPlayer);
    let player_position = game[Get.Transform][find_navigable(game, 1, 1)].Translation;
    // Player.
    game.add({
        Translation: [player_position[0], 5, player_position[2]],
        Using: [
            named("player"),
            player_control(),
            walking(1, 1),
            path_find(),
            move(25, 0),
            collide(true, [4, 7, 1]),
            ray_target(RayFlag.None),
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
            let randomPassage = ~~(Math.random() * (max - min + 1)) + min;
            let first = false;
            let second = false;
            if (game.Grid[y2][bisection] == Infinity) {
                randomPassage = max;
                first = true;
            }
            if (game.Grid[y1][bisection] == Infinity) {
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
                game.Grid[i][bisection] = NaN;
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
            let randomPassage = ~~(Math.random() * (max - min + 1)) + min;
            let first = false;
            let second = false;
            if (game.Grid[bisection][x2] == Infinity) {
                randomPassage = max;
                first = true;
            }
            if (game.Grid[bisection][x1] == Infinity) {
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
                game.Grid[bisection][i] = NaN;
            }
            generate_maze(game, [x1, x2], [y1, bisection], size);
            generate_maze(game, [x1, x2], [bisection, y2], size);
        }
    }
}
