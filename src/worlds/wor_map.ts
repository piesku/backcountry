import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {click_control} from "../components/com_control_click.js";
import {player_control} from "../components/com_control_player.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {find_navigable} from "../components/com_navigable.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {shoot} from "../components/com_shoot.js";
import {Game} from "../game.js";
import {snd_music} from "../sounds/snd_music.js";

let map_size = 10;
export function world_map(game: Game) {
    game.world = [];
    game.distance_field = [];

    game.gl.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    game.add(angle_camera_blueprint);

    // Ground.
    for (let x = 0; x < map_size; x++) {
        game.distance_field[x] = [];
        for (let y = 0; y < map_size; y++) {
            let is_walkable = Math.random() > 0.4;
            game.distance_field[x][y] = is_walkable ? Infinity : "kurwamać";
            let tile_blueprint = get_tile_blueprint(game, is_walkable, x, y);

            game.add({
                ...tile_blueprint,
                translation: [(-(map_size / 2) + x) * 8, 0, (-(map_size / 2) + y) * 8],
            });
        }
    }

    // Light and audio source.
    game.add({
        translation: [0, 25, 0],
        using: [audio_source({music: snd_music})],
        children: [
            {
                translation: [20, 0, -20],
                using: [light([1, 1, 1], 20)],
            },
            {
                translation: [-15, 0, 15],
                using: [light([1, 1, 1], 20)],
            },
            {
                translation: [-10, 0, -10],
                using: [light([1, 1, 1], 20)],
            },
        ],
    });

    let player_position =
        game[Get.Transform][
            find_navigable(game, Math.floor(map_size / 2), Math.floor(map_size / 2))
        ].translation;
    // Player.
    game.add({
        translation: [player_position[0], 5, player_position[2]],
        using: [
            player_control(Math.floor(map_size / 2), Math.floor(map_size / 2)),
            click_control(),
            move(25, 0),
            collide(true, [4, 7, 1]),
            ray_target(RayFlag.None),
            shoot(),
        ],
        children: [get_character_blueprint(game)],
    });
}
