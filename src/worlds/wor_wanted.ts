import {get_character_blueprint} from "../blueprints/blu_character.js";
import {Anim, animate, AnimationFlag} from "../components/com_animate.js";
import {camera_ortho} from "../components/com_camera.js";
import {light} from "../components/com_light.js";
import {Game} from "../game.js";
import {set_seed} from "../math/random.js";

export function world_wanted(game: Game) {
    set_seed(game.BountySeed);
    game.Camera = undefined;
    game.Resized = true;
    game.World = [];
    game.GL.clearColor(0.9, 0.7, 0.3, 1);

    // Bandit.
    game.Add({
        Using: [
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
        Children: [get_character_blueprint(game)],
    });

    // Camera.
    game.Add({
        Translation: [0, 2, 10],
        Using: [camera_ortho(10)],
    });

    // Directional light.
    game.Add({
        Translation: [1, 1, 1],
        Using: [light([0.5, 0.5, 0.5], 0)],
    });

    // Point light.
    game.Add({
        Translation: [-15, 15, 15],
        Using: [light([1, 1, 1], 25)],
    });
}
