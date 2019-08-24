import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {click_control} from "../components/com_control_click.js";
import {player_control} from "../components/com_control_player.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {ray_cast} from "../components/com_ray_cast.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {shoot} from "../components/com_shoot.js";
import {Game} from "../game.js";
import {snd_music} from "../sounds/snd_music.js";

export function world_stage(game: Game) {
    game.world = [];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    // Player.
    game.add({
        translation: [0, 5, 0],
        using: [
            player_control(),
            click_control(),
            move(25, 0),
            collide(true, [4, 7, 1]),
            ray_target(RayFlag.None),
            ray_cast(),
            shoot(),
        ],
        children: [get_character_blueprint(game)],
    });

    // Camera.
    game.add(angle_camera_blueprint);

    // Ground.
    for (let x = -10; x < 10; x++) {
        for (let y = -10; y < 10; y++) {
            let is_walkable = Math.random() > 0.04;
            let tile_blueprint = get_tile_blueprint(game, is_walkable);
            game.add({
                ...tile_blueprint,
                translation: [x * 8, 0, y * 8],
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

    // Villain.
    game.add({
        translation: [10, 5, -10],
        using: [collide(true, [4, 7, 1]), ray_target(RayFlag.Attackable)],
        children: [get_character_blueprint(game)],
    });

    // Villain.
    game.add({
        translation: [15, 5, -15],
        using: [collide(true, [4, 7, 1]), ray_target(RayFlag.Attackable)],
        children: [get_character_blueprint(game)],
    });

    // Villain.
    game.add({
        translation: [20, 5, -20],
        using: [collide(true, [4, 7, 1]), ray_target(RayFlag.Attackable)],
        children: [get_character_blueprint(game)],
    });
}
