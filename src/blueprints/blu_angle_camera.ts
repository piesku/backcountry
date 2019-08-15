import {camera} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Blueprint} from "./blu_common";

export let angle_camera_blueprint: Blueprint = {
    children: [
        {
            translation: [5, 5, 5],
            rotation: [-0.354, 0.354, 0.146, 0.854],
            using: [
                (game: Game) => camera(game.canvas.width / game.canvas.height, 1, 0.1, 1000)(game),
            ],
        },
    ],
};
