import {get_character_blueprint} from "../blueprints/blu_character.js";
import {fly_camera_blueprint} from "../blueprints/blu_fly_camera.js";
import {light} from "../components/com_light.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";

export function world_characters(game: Game) {
    game.world = [];
    game.state.world = "characters";
    game.gl.clearColor(1, 0.3, 0.3, 1);

    game.canvas.addEventListener("click", () => game.canvas.requestPointerLock());

    // Player-controlled camera.
    game.add({
        ...fly_camera_blueprint,
        translation: [50, 50, 50],
        rotation: from_euler([], 35, -135, 0),
    });

    // characters
    for (let x = -5; x < 5; x++) {
        for (let y = -5; y < 5; y++) {
            setTimeout(() => {
                game.add({
                    ...get_character_blueprint(game),
                    translation: [x * 15 + 0.5, 0, y * 15 + 0.5],
                });
            }, Math.random() * Math.random() * 300);
        }
    }

    // Light source.
    game.add({
        translation: [-25, 15, -25],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [-25, 15, 25],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [25, 15, -25],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [25, 15, 25],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [-50, 15, -50],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [-50, 15, 50],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [50, 15, -50],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [50, 15, 50],
        using: [light([1, 1, 1], 25)],
    });

    game.add({
        translation: [0, 15, 75],
        using: [light([1, 1, 1], 25)],
    });
}
