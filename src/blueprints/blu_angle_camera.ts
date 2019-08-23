import {camera_ortho} from "../components/com_camera.js";
import {ray_cast} from "../components/com_ray_cast.js";
import {Blueprint} from "./blu_common";

export let angle_camera_blueprint: Blueprint = {
    children: [
        {
            translation: [25, 25, 25],
            // Isometric projection: Y 45°, X -35.264°, Z 0°
            rotation: [-0.28, 0.364, 0.116, 0.88],
            using: [camera_ortho(25, 1, 100), ray_cast()],
        },
    ],
};
