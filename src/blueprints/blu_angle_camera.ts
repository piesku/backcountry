import {camera_ortho} from "../components/com_camera.js";
import {mimic} from "../components/com_mimic.js";
import {find_first} from "../components/com_named.js";
import {select} from "../components/com_select.js";
import {Game} from "../game.js";
import {Blueprint} from "./blu_common";

export let angle_camera_blueprint: Blueprint = {
    translation: [0, 20, 0],
    using: [(game: Game) => mimic(find_first(game, "player"))(game)],
    children: [
        {
            translation: [25, 25, 25],
            // Isometric projection: Y 45°, X -35.264°, Z 0°
            rotation: [-0.28, 0.364, 0.116, 0.88],
            using: [camera_ortho(25, 1, 100), select()],
        },
    ],
};
