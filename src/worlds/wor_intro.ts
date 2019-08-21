import {get_character_blueprint} from "../blueprints/blu_character.js";
import {audio_source} from "../components/com_audio_source.js";
import {camera_perspective} from "../components/com_camera.js";
import {light} from "../components/com_light.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {snd_music} from "../sounds/snd_music.js";

export function world_intro(game: Game) {
    game.world = [];
    game.gl.clearColor(0.95, 0.73, 0.35, 1);

    // Player.
    game.add({
        using: [],
        children: [get_character_blueprint(game)],
    });

    // Camera.
    game.add({
        translation: [-5, 0, 15],
        rotation: from_euler([], 0, -45, 0),
        using: [camera_perspective(1, 1, 100)],
    });

    // Light and audio source.
    game.add({
        translation: [-15, 15, 15],
        using: [audio_source({music: snd_music})],
        children: [
            {
                using: [light([1, 1, 1], 25)],
            },
        ],
    });
}
