import {main_palette, PaletteColors} from "../blueprints/blu_building.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {create_iso_camera} from "../blueprints/blu_iso_camera.js";
import {get_mine_entrance_blueprint} from "../blueprints/blu_mine_entrance.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide, RayTarget} from "../components/com_collide.js";
import {player_control} from "../components/com_control_player.js";
import {draw} from "../components/com_draw.js";
import {health} from "../components/com_health.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {npc} from "../components/com_npc.js";
import {render_vox} from "../components/com_render_vox.js";
import {shoot} from "../components/com_shoot.js";
import {walking} from "../components/com_walking.js";
import {Game} from "../game.js";
import {integer, set_seed} from "../math/random.js";
import {snd_baseline} from "../sounds/snd_baseline.js";
import {snd_wind} from "../sounds/snd_wind.js";
import {widget_healthbar} from "../widgets/wid_healthbar.js";
import {generate_maze} from "./wor_mine.js";

export function world_desert(game: Game) {
    set_seed(game.BountySeed);
    let map_size = 30;
    let entrance_position_x = integer(20, 25) || 20;
    let entrance_position_z = integer(10, 20) || 10;
    let entrance_width = 4;
    let entrance_length = 6;

    game.Camera = undefined;
    game.World = [];
    game.Grid = [];

    game.GL.clearColor(0.8, 0.3, 0.2, 1);

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

    generate_maze(game, [0, map_size - 1], [0, map_size - 1], map_size, 0.6);

    for (let z = entrance_position_z; z < entrance_position_z + entrance_length + 3; z++) {
        for (let x = entrance_position_x - 1; x < entrance_position_x + entrance_width - 1; x++) {
            if (
                (x == entrance_position_x - 1 + entrance_width - 2 && z !== entrance_position_z) ||
                z >= entrance_position_z + entrance_length
            ) {
                game.Grid[x][z] = Infinity;
            } else {
                game.Grid[x][z] = NaN;
            }
        }
    }

    // Ground.
    for (let x = 0; x < map_size; x++) {
        for (let y = 0; y < map_size; y++) {
            let is_walkable = game.Grid[x][y] == Infinity;
            let tile_blueprint = get_tile_blueprint(game, is_walkable, x, y);

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
        Using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_baseline)],
        Children: [
            {
                Using: [audio_source(snd_wind)],
            },
        ],
    });

    // Cowboys.
    let cowboys_count = 20;
    for (let i = 0; i < cowboys_count; i++) {
        let x = integer(4, map_size);
        let y = integer(4, map_size);
        if (game.Grid[x] && game.Grid[x][y] && !isNaN(game.Grid[x][y])) {
            game.Add({
                Translation: [
                    (-(map_size / 2) + x) * 8,
                    4.3 + Math.random(),
                    (-(map_size / 2) + y) * 8,
                ],
                Using: [
                    npc(false),
                    walking(x, y),
                    move(integer(8, 15)),
                    collide(true, [7, 7, 7], RayTarget.Attackable),
                    health(1500 * game.ChallengeLevel),
                    shoot(),
                    audio_source(),
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

    let entrance = get_mine_entrance_blueprint(game);
    game.Add({
        Translation: [
            (-(map_size / 2) + entrance_position_x) * 8 + 4,
            0,
            (-(map_size / 2) + entrance_position_z) * 8 + 4,
        ],
        ...entrance,
    });

    // Player.
    set_seed(game.PlayerSeed);
    game.Player = game.Add({
        Translation: [-112, 5, -112],
        Using: [
            player_control(),
            walking(1, 1),
            move(25, 0),
            collide(true, [3, 7, 3], RayTarget.Player),
            health(10000),
            shoot(),
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

    // Dio-cube
    game.Add({
        Scale: [map_size * 8, map_size * 2, map_size * 8],
        Translation: [-4, -map_size + 0.49, -4],
        Using: [
            render_vox(Float32Array.from([0, 0, 0, PaletteColors.desert_ground_1]), main_palette),
        ],
    });

    // Camera.
    game.Add(create_iso_camera(game.Player));
}
