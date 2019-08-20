import {get_character_blueprint} from "../blueprints/blu_character.js";
import {fly_camera_blueprint} from "../blueprints/blu_fly_camera.js";
import {collide} from "../components/com_collide.js";
import {light} from "../components/com_light.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Cube} from "../shapes/Cube.js";

export function world_characters(game: Game) {
    game.world = [];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    game.canvas.addEventListener("click", () => game.canvas.requestPointerLock());

    // Player-controlled camera.
    game.add({
        translation: [13.11, 3.48, 12.28],
        ...fly_camera_blueprint,
        rotation: [
            -0.011444001077517297,
            0.9138615501373802,
            -0.025820087072619922,
            -0.4050424979226309,
        ],
    });

    // Ground.
    for (let x = -5; x < 5; x++) {
        for (let y = -5; y < 5; y++) {
            game.add({
                translation: [x * 3 + 0.5, -1.5, y * 3 + 0.5],
                scale: [3, 1, 3],
                using: [
                    render_shaded(game.materials[Mat.Gouraud], Cube, [1, 1, 0.3, 1]),
                    collide(false),
                    rigid_body(false),
                ],
            });
        }
    }

    // characters
    for (let x = -5; x < 5; x++) {
        for (let y = -5; y < 5; y++) {
            setTimeout(() => {
                game.add({
                    ...get_character_blueprint(game),
                    translation: [x * 3 + 0.5, 0, y * 3 + 0.5],
                });
            }, Math.random() * Math.random() * 300);
        }
    }

    // Light source.
    game.add({
        translation: [-5, 3, -5],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [-5, 3, 5],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [5, 3, -5],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [5, 3, 5],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [-10, 3, -10],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [-10, 3, 10],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [10, 3, -10],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [10, 3, 10],
        using: [light([1, 1, 1], 5)],
    });

    game.add({
        translation: [0, 3, 15],
        using: [light([1, 1, 1], 5)],
    });
}
