import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {get_tile_blueprint} from "../blueprints/blu_ground_tile.js";
import {audio_source} from "../components/com_audio_source.js";
import {click_control} from "../components/com_control_click.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {named} from "../components/com_named.js";
import {selectable} from "../components/com_selectable.js";
import {Game} from "../game.js";
import {snd_music} from "../sounds/snd_music.js";

export function world_stage(game: Game) {
    game.world = [];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    // Player.
    game.add({
        translation: [0, 0.9, 0],
        using: [
            named("player"),
            click_control(),
            move(5, 0),
            // collide(true, [1, 1.5, 1]),
            // rigid_body(true),
            selectable(),
        ],
        children: [get_character_blueprint(game)],
    });

    // Camera.
    game.add(angle_camera_blueprint);

    // Ground.
    for (let x = -10; x < 10; x++) {
        for (let y = -10; y < 10; y++) {
            let tile_blueprint = get_tile_blueprint(game);
            game.add({
                ...tile_blueprint,
                translation: [x * 1.6, 0, y * 1.6],
            });
        }
    }

    // Light and audio source.
    game.add({
        translation: [0, 5, 0],
        using: [audio_source({music: snd_music})],
        children: [
            {
                translation: [4, 0, -4],
                using: [light([1, 1, 1], 4)],
            },
            {
                translation: [-3, 0, 3],
                using: [light([1, 1, 1], 4)],
            },
            {
                translation: [-2, 0, -2],
                using: [light([1, 1, 1], 4)],
            },
        ],
    });
}
