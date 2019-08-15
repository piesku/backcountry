import {camera_ortho} from "../components/com_camera.js";
import {Blueprint} from "./blu_common";

export let angle_camera_blueprint: Blueprint = {
    children: [
        {
            translation: [5, 5, 5],
            // Y -45°, X -30°, Z 0°
            rotation: [-0.239, 0.37, 0.099, 0.892],
            using: [camera_ortho(7, 0.1, 1000)],
        },
    ],
};
