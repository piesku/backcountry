import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
import {audio_source} from "../components/com_audio_source.js";
import {collide} from "../components/com_collide.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {player_control} from "../components/com_player_control.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";
import {snd_music} from "../sounds/snd_music.js";

export function world_stage(game: Game) {
    game.world = [];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    // Player.
    game.add({
        translation: [0, 3, 0],
        using: [
            player_control(true, true, false),
            move(5, 0.5),
            collide(true, [1, 1.5, 1]),
            rigid_body(true),
        ],
        children: [get_character_blueprint(game)],
    });

    // Camera.
    game.add(angle_camera_blueprint);

    // Ground.
    game.add({
        translation: [0, -0.5, 0],
        scale: [10, 1, 10],
        using: [
            render_shaded(game.materials[Mat.Flat], Cube, [1, 1, 0.3, 1]),
            collide(false),
            rigid_body(false),
        ],
    });

    // Light and audio source.
    game.add({
        translation: [0, 5, 0],
        using: [audio_source({music: snd_music}, "music")],
        children: [
            {
                translation: [5, 0, 5],
                using: [light([1, 1, 1], 5)],
            },
            {
                translation: [5, 0, -5],
                using: [light([1, 1, 1], 4)],
            },
            {
                translation: [-5, 0, 5],
                using: [light([1, 1, 1], 3)],
            },
            {
                translation: [-5, 0, -5],
                using: [light([1, 1, 1], 2)],
            },
        ],
    });
}
