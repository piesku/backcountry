import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {create_iso_camera} from "../blueprints/blu_iso_camera.js";
import {get_mine_wall_blueprint} from "../blueprints/blu_mine_wall.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide, RayTarget} from "../components/com_collide.js";
import {player_control} from "../components/com_control_player.js";
import {draw} from "../components/com_draw.js";
import {health} from "../components/com_health.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {find_navigable} from "../components/com_navigable.js";
import {npc} from "../components/com_npc.js";
import {shoot} from "../components/com_shoot.js";
import {walking} from "../components/com_walking.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, set_seed} from "../math/random.js";
import {snd_music} from "../sounds/snd_music.js";
import {widget_healthbar} from "../widgets/wid_healthbar.js";

export function world_mine(game: Game) {
    set_seed(game.SeedBounty);

    game.World = [];
    game.Grid = [];

    game.GL.clearColor(1, 0.3, 0.3, 1);

    let map_size = 30;
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
                : get_mine_wall_blueprint(game, palette);

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
    let x = map_size - 2; //integer(0, map_size);
    let y = map_size - 2; //integer(0, map_size);
    if (game.Grid[x] && game.Grid[x][y] && !isNaN(game.Grid[x][y])) {
        game.Add({
            Scale: [1.5, 1.5, 1.5],
            Translation: [(-(map_size / 2) + x) * 8, 7.5, (-(map_size / 2) + y) * 8],
            Rotation: from_euler([], 0, integer(0, 3) * 90, 0),
            Using: [
                npc(false, true),
                walking(x, y),
                move(integer(12, 16), 0),
                collide(true, [7, 7, 7], RayTarget.Attackable),
                health(5000),
                shoot(1),
            ],
            Children: [
                (set_seed(game.SeedBounty), get_character_blueprint(game)),
                {
                    Translation: [0, 10, 0],
                    Using: [draw(widget_healthbar)],
                },
            ],
        });
    }

    let cowboys_count = 15;
    for (let i = 0; i < cowboys_count; i++) {
        let x = integer(4, map_size);
        let y = integer(4, map_size);
        if (game.Grid[x] && game.Grid[x][y] && !isNaN(game.Grid[x][y])) {
            game.Add({
                Translation: [(-(map_size / 2) + x) * 8, 5, (-(map_size / 2) + y) * 8],
                Using: [
                    npc(false),
                    walking(x, y),
                    move(integer(8, 15)),
                    collide(true, [7, 7, 7], RayTarget.Attackable),
                    health(2000),
                    shoot(1),
                ],
                Children: [
                    get_character_blueprint(game),
                    {
                        Translation: [0, 10, 0],
                        Using: [draw(widget_healthbar)],
                    },
                ],
            });
        }
    }

    let player_position = game[Get.Transform][find_navigable(game, 1, 1)].Translation;
    // Player.
    set_seed(game.SeedPlayer);
    game.Player = game.Add({
        Translation: [player_position[0], 5, player_position[2]],
        Using: [
            player_control(),
            walking(1, 1),
            move(25, 0),
            collide(true, [3, 7, 3], RayTarget.Player),
            health(10000),
            shoot(1),
            audio_source(),
        ],
        Children: [
            get_character_blueprint(game),
            {
                Translation: [0, 25, 0],
                Using: [light([1, 1, 1], 20)],
            },
            {
                Translation: [0, 10, 0],
                Using: [draw(widget_healthbar)],
            },
        ],
    });

    // Camera.
    game.Add(create_iso_camera(game.Player));
}

export function generate_maze(
    game: Game,
    [x1, x2]: number[],
    [y1, y2]: number[],
    size: number,
    probablity: number
) {
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
                game.Grid[i][bisection] = Math.random() > probablity ? NaN : Infinity;
            }
            generate_maze(game, [x1, bisection], [y1, y2], size, probablity);
            generate_maze(game, [bisection, x2], [y1, y2], size, probablity);
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
                game.Grid[bisection][i] = Math.random() > probablity ? NaN : Infinity;
            }
            generate_maze(game, [x1, x2], [y1, bisection], size, probablity);
            generate_maze(game, [x1, x2], [bisection, y2], size, probablity);
        }
    }
}
