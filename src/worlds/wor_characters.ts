import {fly_camera_blueprint} from "../blueprints/blu_fly_camera.js";
import {collide} from "../components/com_collide.js";
import {light} from "../components/com_light.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {render_vox} from "../components/com_render_vox.js";
import {rigid_body} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {Model} from "../model.js";
import {Cube} from "../shapes/Cube.js";

export function world_characters(game: Game) {
    game.world = [];
    game.gl.clearColor(1, 0.3, 0.3, 1);

    // Player-controlled camera.
    game.add({
        translation: [0, 0, 5],
        ...fly_camera_blueprint,
    });

    // Ground.
    game.add({
        translation: [0, -2, 0],
        scale: [10, 1, 10],
        using: [
            render_shaded(game.materials[Mat.Gouraud], Cube, [1, 1, 0.3, 1]),
            collide(false),
            rigid_body(false),
        ],
    });

    game.add({
        translation: [0, 0, 0],
        scale: [0.5, 0.5, 0.5],
        using: [
            render_vox({
                offsets: new Float32Array([0.5, 0.5, 0.5, 0, 2, 0.5, 1.5, 1]),
                size: [1, 1, 1],
            } as Model),
        ],
    });
    // Light source.
    game.add({
        translation: [0, 3, 5],
        using: [light([1, 1, 1], 5)],
    });
}
