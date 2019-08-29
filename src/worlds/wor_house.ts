import {Action} from "../actions.js";
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
import {named} from "../components/com_named.js";
import {find_navigable} from "../components/com_navigable.js";
import {portal} from "../components/com_portal.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {shoot} from "../components/com_shoot.js";
import {trigger} from "../components/com_trigger.js";
import {Game} from "../game.js";
import {snd_miss} from "../sounds/snd_miss.js";
import {snd_shoot} from "../sounds/snd_shoot.js";
import {world_map} from "./wor_map.js";

let map_size = 5;

export function world_house(game: Game) {
    game.world = [];
    game.distance_field = [];

    game.gl.clearColor(1, 0.3, 0.3, 1);

    // Ground.
    for (let x = 0; x < map_size; x++) {
        game.distance_field[x] = [];
        for (let y = 0; y < map_size; y++) {
            let is_walkable = Math.random() > 0.04;
            game.distance_field[x][y] = is_walkable ? Infinity : "a";
            let tile_blueprint = get_tile_blueprint(game, is_walkable, x, y);

            game.add({
                ...tile_blueprint,
                translation: [(-(map_size / 2) + x) * 8, 0, (-(map_size / 2) + y) * 8],
            });
        }
    }

    game.add({
        translation: [5, 5, 5],
        scale: [8, 8, 8],
        using: [collide(false), trigger(Action.EnterArea), portal(world_map)],
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
    game.add({
        translation: [player_position[0], 5, player_position[2]],
        using: [
            named("player"),
            player_control(Math.floor(map_size / 2), Math.floor(map_size / 2)),
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

    // Camera.
    game.add(angle_camera_blueprint);
}
