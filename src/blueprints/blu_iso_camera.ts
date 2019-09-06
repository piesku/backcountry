import {camera_ortho} from "../components/com_camera.js";
import {mimic} from "../components/com_mimic.js";
import {select} from "../components/com_select.js";
import {shake} from "../components/com_shake.js";
import {Entity} from "../game.js";
import {Blueprint} from "./blu_common";

export function create_iso_camera(player: Entity) {
    return <Blueprint>{
        Translation: [0, 20, 0],
        Using: [mimic(player)],
        Children: [
            {
                Translation: [25, 25, 25],
                // Isometric projection: Y 45°, X -35.264°, Z 0°
                Rotation: [-0.28, 0.364, 0.116, 0.88],
                Children: [
                    {
                        Using: [camera_ortho(25, 1, 100), select(), shake()],
                    },
                ],
            },
        ],
    };
}
