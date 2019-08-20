import {angle_camera_blueprint} from "../blueprints/blu_angle_camera.js";
import {get_character_blueprint} from "../blueprints/blu_character.js";
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
    game.add(angle_camera_blueprint);

    // Ground.
    game.add({
        translation: [0, -1.5, 0],
        scale: [10, 1, 10],
        using: [
            render_shaded(game.materials[Mat.Gouraud], Cube, [1, 1, 0.3, 1]),
            collide(false),
            rigid_body(false),
        ],
    });

    // characters
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            setTimeout(() => {
                game.add({
                    ...get_character_blueprint(game),
                    translation: [x * 3, 0, y * 3],
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
}
