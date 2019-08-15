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
    game.add({
        translation: [0, -1.5, 0],
        scale: [10, 1, 10],
        using: [
            render_shaded(game.materials[Mat.Flat], Cube, [1, 1, 0.3, 1]),
            collide(false),
            rigid_body(false),
        ],
    });

    game.add(get_character_blueprint(game));

    // Light source.
    game.add({
        translation: [2, 3, 5],
        using: [light([1, 1, 1], 6)],
    });
}
