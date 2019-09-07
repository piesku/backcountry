import {get_character_blueprint} from "../blueprints/blu_character.js";
import {camera_perspective} from "../components/com_camera.js";
import {collide, RayTarget} from "../components/com_collide.js";
import {light} from "../components/com_light.js";
import {mimic} from "../components/com_mimic.js";
import {named} from "../components/com_named.js";
import {select} from "../components/com_select.js";
import {Entity, Game} from "../game.js";
import {from_euler} from "../math/quat.js";
import {set_seed} from "../math/random.js";

export function world_intro(game: Game) {
    game.World = [];
    game.GL.clearColor(0.95, 0.73, 0.35, 1);

    // Available characters.
    let most_recent: Entity = -1;
    for (let i = 0; i < game.Trophies.length; i++) {
        set_seed(game.Trophies[i]);
        most_recent = game.Add({
            Translation: [i, 0, 10 * i],
            Using: [
                collide(false, [3, 7, 3], RayTarget.Choosable),
                named((game.Trophies[i] as unknown) as string),
            ],
            Children: [get_character_blueprint(game)],
        });
    }

    // Camera.
    game.Add({
        Using: [mimic(most_recent)],
        Children: [
            {
                Translation: [-5, 0, 15],
                Rotation: from_euler([], 0, -45, 0),
                Using: [camera_perspective(1, 1, 100), select()],
            },
            {
                // Light.
                Translation: [-10, 15, 10],
                Children: [
                    {
                        Using: [light([1, 1, 1], 20)],
                    },
                ],
            },
        ],
    });
}
