import {get_building_blueprint} from "../blueprints/blu_building.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {create_iso_camera} from "../blueprints/blu_iso_camera.js";
import {get_town_gate_blueprint} from "../blueprints/blu_town_gate.js";
import {audio_source} from "../components/com_audio_source.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {npc} from "../components/com_npc.js";
import {walking} from "../components/com_walking.js";
import {Game} from "../game.js";
import {integer, rand, set_seed} from "../math/random.js";
import {snd_jingle} from "../sounds/snd_jingle.js";
import {snd_wind} from "../sounds/snd_wind.js";
import {calculate_distance} from "../systems/sys_player_control.js";

export function world_map(game: Game) {
    set_seed(game.ChallengeSeed);
    let map_size = 30;
    let fence_line = 20;
    let fence_gate_size = 16;

    game.World = [];
    game.Grid = [];

    game.GL.clearColor(0.8, 0.3, 0.2, 1);

    // Ground.
    for (let x = 0; x < map_size; x++) {
        game.Grid[x] = [];
        for (let y = 0; y < map_size; y++) {
            let is_fence = x === fence_line;
            // cactuses & stones here
            // We set this to true, because we don't want props to be
            // generated on the fence line
            let is_walkable = is_fence || rand() > 0.04;

            game.Grid[x][y] = is_walkable && !is_fence ? Infinity : NaN;
            let tile_blueprint = get_tile_blueprint(game, is_walkable, x, y, false);

            game.Add({
                ...tile_blueprint,
                Translation: [(-(map_size / 2) + x) * 8, 0, (-(map_size / 2) + y) * 8],
            });
        }
    }

    game.Add(get_town_gate_blueprint(game, map_size, fence_gate_size, fence_line));

    // Directional light and Soundtrack
    game.Add({
        Translation: [1, 2, -1],
        Using: [light([0.7, 0.7, 0.7], 0), audio_source(snd_jingle)],
        Children: [
            {
                Using: [audio_source(snd_wind)],
            },
        ],
    });

    // Buildings
    let buildings_count = 4; //~~((map_size * 8) / 35);
    // let sherriff_house_index = integer(0, buildings_count - 1);
    // let sherriff_house_index = ~~(buildings_count / 2) - 1;
    // let starting_position = 76.5;
    let starting_position = 0;
    let building_x_tile = 10;
    for (let i = 0; i < buildings_count; i++) {
        let building_blu = get_building_blueprint(game);

        let building_x = building_blu.Size[0] / 8;
        let building_z = building_blu.Size[1] / 8;
        for (let z = starting_position; z < starting_position + building_z; z++) {
            for (let x = building_x_tile; x < building_x_tile + building_x; x++) {
                game.Grid[x][z] = NaN;
            }
        }

        game.Add({
            Translation: [
                (-(map_size / 2) + building_x_tile) * 8 - 1.5,
                0,
                (-(map_size / 2) + starting_position) * 8 - 3.5,
            ],
            Children: [building_blu.Blueprint],
        });

        starting_position += building_blu.Size[1] / 8 + integer(1, 2);
    }

    // Cowboys.
    let cowboys_count = 15;
    for (let i = 0; i < cowboys_count; i++) {
        let x = integer(0, map_size);
        let y = integer(0, map_size);
        if (game.Grid[x] && game.Grid[x][y] && !isNaN(game.Grid[x][y])) {
            game.Add({
                Translation: [(-(map_size / 2) + x) * 8, 5, (-(map_size / 2) + y) * 8],
                Using: [npc(), walking(x, y), move(integer(15, 25), 0)],
                Children: [get_character_blueprint(game)],
            });
        }
    }

    calculate_distance(game, map_size / 2, map_size / 2);
    game.Player = game.Add({
        Using: [walking(map_size / 2, map_size / 2)],
    });

    // Camera.
    game.Add(create_iso_camera(game.Player));
}
