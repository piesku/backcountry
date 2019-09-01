import {get_character_blueprint} from "../blueprints/blu_character.js";
import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {camera_ortho} from "../components/com_camera.js";
import {light} from "../components/com_light.js";
import {Game} from "../game.js";
import {set_seed} from "../math/random.js";

export function world_wanted(game: Game) {
    set_seed(game.seed_bounty);
    game.world = [];
    game.gl.clearColor(1, 0.8, 0.6, 1);

    // Player.
    game.add({
        using: [
            animate({
                [Anim.Idle]: {
                    Keyframes: [
                        {
                            Timestamp: 0,
                            Rotation: [0, 0, 0, 1],
                        },
                        {
                            Timestamp: 2,
                            Rotation: [0, 1, 0, 0],
                        },
                        {
                            Timestamp: 4,
                            Rotation: [0, 0, 0, -1],
                        },
                    ],
                    Flags: AnimationFlag.Loop,
                },
            }),
        ],
        children: [get_character_blueprint(game)],
    });

    // Camera.
    game.add({
        translation: [0, 2, 10],
        using: [camera_ortho(10, 1, 100)],
    });

    // Directional light.
    game.add({
        translation: [1, 1, 1],
        using: [light([0.5, 0.5, 0.5], 0)],
    });

    // Point light.
    game.add({
        translation: [-15, 15, 15],
        using: [light([1, 1, 1], 25)],
    });
}
