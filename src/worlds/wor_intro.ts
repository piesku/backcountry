import {get_character_blueprint} from "../blueprints/blu_character.js";
import {camera_perspective} from "../components/com_camera.js";
import {collide} from "../components/com_collide.js";
import {light} from "../components/com_light.js";
import {RayFlag, ray_target} from "../components/com_ray_target.js";
import {select} from "../components/com_select.js";
import {Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {set_seed} from "../math/random.js";

export function world_intro(game: Game) {
    game.World = [];
    game.GL.clearColor(0.95, 0.73, 0.35, 1);

    // Player.
    set_seed(game.SeedPlayer);
    game.Add({
        Using: [collide(false, [3, 7, 3]), ray_target(RayFlag.Player)],
        Children: [get_character_blueprint(game)],
    });

    // Camera.
    game.Add({
        Translation: [-5, 0, 15],
        Rotation: from_euler([], 0, -45, 0),
        Using: [camera_perspective(1, 1, 100), select()],
    });

    // Light.
    game.Add({
        Translation: [-15, 15, 15],
        Children: [
            {
                Using: [light([1, 1, 1], 25)],
            },
        ],
    });
}
