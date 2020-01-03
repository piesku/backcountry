import {Action} from "../actions.js";
import {get_building_blueprint, main_palette, PaletteColors} from "../blueprints/blu_building.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_gold_blueprint} from "../blueprints/blu_gold.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {create_iso_camera} from "../blueprints/blu_iso_camera.js";
import {get_town_gate_blueprint} from "../blueprints/blu_town_gate.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide, RayTarget} from "../components/com_collide.js";
import {player_control} from "../components/com_control_player.js";
import {draw} from "../components/com_draw.js";
import {health} from "../components/com_health.js";
import {Get} from "../components/com_index.js";
import {lifespan} from "../components/com_lifespan.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {find_navigable} from "../components/com_navigable.js";
import {npc} from "../components/com_npc.js";
import {render_vox} from "../components/com_render_vox.js";
import {trigger} from "../components/com_trigger.js";
import {walking} from "../components/com_walking.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {integer, rand, set_seed} from "../math/random.js";
import {snd_music} from "../sounds/snd_music.js";
import {snd_neigh} from "../sounds/snd_neigh.js";
import {snd_wind} from "../sounds/snd_wind.js";
import {calculate_distance} from "../systems/sys_control_player.js";
import {widget_exclamation} from "../widgets/wid_exclamation.js";
import {widget_gold} from "../widgets/wid_gold.js";

export function world_town(game: Game, is_intro?: boolean, bounty_collected?: number) {
    set_seed(game.ChallengeSeed);
    let map_size = 30;
    let fence_line = 20;
    let back_fence_line = 1;
    let fence_gate_size = 16;

    let characters_spawning_points = [
        0,
        (map_size / 2) * 30 + map_size / 2,
        (map_size / 2) * 30 + map_size / 2 + 3,
        (map_size / 2 + 3) * 30 + map_size / 2 - 8,
    ];

    game.Camera = undefined;
    game.World = [];
    game.Grid = [];

    game.GL.clearColor(0.8, 0.3, 0.2, 1);

    // Ground.
    for (let x = 0; x < map_size; x++) {
        game.Grid[x] = [];
        for (let y = 0; y < map_size; y++) {
            let is_fence = x == fence_line || x == back_fence_line;
            // cactuses & stones here
            // We set this to true, because we don't want props to be
            // generated on the fence line
            let is_walkable =
                is_fence ||
                x == back_fence_line - 1 ||
                characters_spawning_points.includes(x * 30 + y) ||
                rand() > 0.04;

            game.Grid[x][y] = is_walkable && !is_fence ? Infinity : NaN;
            let tile_blueprint = get_tile_blueprint(game, is_walkable, x, y, false);

            game.Add({
                ...tile_blueprint,
                Translation: [(-(map_size / 2) + x) * 8, 0, (-(map_size / 2) + y) * 8],
            });
        }
    }

    game.Add(get_town_gate_blueprint(game, fence_gate_size, fence_line));

    // Buildings
    let buildings_count = 4;
    let starting_position = 0;
    let building_x_tile = 10;
    for (let i = 0; i < buildings_count; i++) {
        let building_blu = get_building_blueprint(game);

        let building_x = building_blu.Size_x / 8;
        let building_z = building_blu.Size_z / 8;

        if (starting_position + building_z > map_size) {
            break;
        }

        game.Add({
            Translation: [
                (-(map_size / 2) + building_x_tile) * 8 - 1.5,
                0,
                (-(map_size / 2) + starting_position) * 8 - 3.5,
            ],
            Children: [building_blu.Blueprint],
        });

        for (let z = starting_position; z < starting_position + building_z; z++) {
            for (let x = building_x_tile; x < building_x_tile + building_x; x++) {
                game.Grid[x][z] = NaN;
            }
        }

        starting_position += building_blu.Size_z / 8 + integer(1, 2);
    }

    // Cowboys.
    let cowboys_count = 20;
    for (let i = 0; i < cowboys_count; i++) {
        let x = integer(0, map_size);
        let y = integer(0, map_size);
        if (game.Grid[x] && game.Grid[x][y] && !isNaN(game.Grid[x][y])) {
            game.Add({
                Translation: [
                    (-(map_size / 2) + x) * 8,
                    4.3 + Math.random(),
                    (-(map_size / 2) + y) * 8,
                ],
                Using: [npc(), walking(x, y), move(integer(15, 25), 0)],
                Children: [get_character_blueprint(game)],
            });
        }
    }

    if (!game.PlayerXY) {
        game.PlayerXY = {X: map_size / 2, Y: map_size / 2};
    }
    calculate_distance(game, game.PlayerXY);

    if (is_intro) {
        game.Add({
            Translation: [1, 2, -1],
            Using: [light([0.7, 0.7, 0.7], 0), audio_source(snd_wind)],
        });

        game.Player = game.Add({
            Using: [walking(map_size / 2, map_size / 2)],
        });
    } else {
        // Directional light and Soundtrack
        game.Add({
            Translation: [1, 2, -1],
            Using: [light([0.5, 0.5, 0.5], 0), audio_source(snd_music)],
            Children: [
                {
                    Using: [audio_source(snd_neigh)],
                },
                {
                    Using: [audio_source(snd_wind)],
                },
            ],
        });

        // Sheriff.
        game.Add({
            Translation: [0, 5, 24],
            Rotation: from_euler([], 0, 90, 0),
            Using: [collide(false, [8, 8, 8]), trigger(Action.GoToWanted)],
            Children: [
                get_character_blueprint(game),
                {
                    Translation: [0, 10, 0],
                    Using: game.BountySeed ? [] : [draw(widget_exclamation, "!"), lifespan()],
                },
            ],
        });

        // Outfitter.
        game.Add({
            Translation: [24, 5, -64],
            Using: [collide(false, [8, 8, 8]), trigger(Action.GoToStore)],
            Children: [
                get_character_blueprint(game),
                {
                    Translation: [0, 10, 0],
                    Using: [draw(widget_exclamation, "$"), lifespan()],
                },
            ],
        });

        // Player.
        let player_position = game[Get.Transform][find_navigable(game, game.PlayerXY)].Translation;
        set_seed(game.PlayerSeed);
        game.Player = game.Add({
            Translation: [player_position[0], 5, player_position[2]],
            Using: [
                player_control(),
                walking(game.PlayerXY.X, game.PlayerXY.Y),
                move(25, 0),
                collide(true, [3, 7, 3], RayTarget.Player),
                health(10000),
            ],
            Children: [
                get_character_blueprint(game),
                {
                    Translation: [0, 25, 0],
                    Using: [light([1, 1, 1], 20)],
                },
            ],
        });

        if (bounty_collected) {
            game.Add({
                Using: [draw(widget_gold, bounty_collected), lifespan(4)],
            });
        }
    }

    game.Add({
        ...get_town_gate_blueprint(game, 0, back_fence_line + 1),
        Rotation: from_euler([], 0, 180, 0),
        // Translation: [-(map_size / 2 - back_fence_line - 1) * 8 - 4, 0, -8],
    });

    if (game.Gold > 0 && game.Gold < 10000) {
        game.Grid[back_fence_line][15] = Infinity;
    }

    game.Add({
        Translation: [-120, 5, -120],
        Using: [collide(false, [8, 8, 8]), trigger(Action.GoToDesert)],
        Children: [get_character_blueprint(game)],
    });

    game.Add({
        ...get_gold_blueprint(game),
        Translation: [56, 1.5, 0],
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

export function world_intro(game: Game) {
    world_town(game, true);
}
