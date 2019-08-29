import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {get_mine_wall_blueprint} from "../blueprints/blu_mine_wall.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {click_control} from "../components/com_control_click.js";
import {player_control} from "../components/com_control_player.js";
import {health} from "../components/com_health.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {named} from "../components/com_named.js";
import {find_navigable} from "../components/com_navigable.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {shoot} from "../components/com_shoot.js";
import {Game} from "../game.js";
import {snd_miss} from "../sounds/snd_miss.js";
import {snd_music} from "../sounds/snd_music.js";
import {snd_shoot} from "../sounds/snd_shoot.js";

export function world_mine(game: Game) {
    let map_size = 15;

    game.world = [];
    game.distance_field = [];

    game.gl.clearColor(1, 0.3, 0.3, 1);

    for (let x = 0; x < map_size; x++) {
        game.distance_field[x] = [];
        for (let y = 0; y < map_size; y++) {
            if (x == 0 || x == map_size - 1 || y == 0 || y == map_size - 1) {
                game.distance_field[x][y] = NaN;
            } else {
                game.distance_field[x][y] = Infinity;
            }
        }
    }

    generate_maze(game, [0, map_size - 1], [0, map_size - 1], map_size);

    let palette = [0.6, 0.4, 0, 0.55, 0, 0];
    // Ground.
    for (let x = 0; x < map_size; x++) {
        for (let y = 0; y < map_size; y++) {
            let is_walkable = game.distance_field[x][y] == Infinity;
            // let is_walkable = true; //Math.random() > 0.04;
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
        using: [light([0.5, 0.5, 0.5], 0), audio_source({music: snd_music}, "music")],
    });

    let player_position = game[Get.Transform][find_navigable(game, 1, 1)].translation;
    // Player.
    game.add({
        translation: [player_position[0], 5, player_position[2]],
        using: [
            named("player"),
            player_control(1, 1, false),
            click_control(),
            move(25, 0),
            collide(true, [4, 7, 1]),
            ray_target(RayFlag.None),
            shoot(1),
            audio_source({shoot: snd_shoot, miss: snd_miss}),
        ],
        children: [
            get_character_blueprint(game),
            {
                translation: [0, 25, 0],
                using: [light([1, 1, 1], 20)],
            },
        ],
    });

    // Villain.
    game.add({
        translation: [(map_size / 2 - 2) * 8, 5, (map_size / 2 - 2) * 8],
        using: [collide(true, [4, 7, 3]), ray_target(RayFlag.Attackable), health(3)],
        children: [get_character_blueprint(game)],
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
            if (game.distance_field[y2][bisection] == Infinity) {
                randomPassage = max;
                first = true;
            }
            if (game.distance_field[y1][bisection] == Infinity) {
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
                game.distance_field[i][bisection] = NaN;
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
            if (game.distance_field[bisection][x2] == Infinity) {
                randomPassage = max;
                first = true;
            }
            if (game.distance_field[bisection][x1] == Infinity) {
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
                game.distance_field[bisection][i] = NaN;
            }
            generate_maze(game, [x1, x2], [y1, bisection], size);
            generate_maze(game, [x1, x2], [bisection, y2], size);
        }
    }
}
