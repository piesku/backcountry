import {camera_ortho} from "../components/com_camera.js";
import {Blueprint} from "./blu_common";

export let angle_camera_blueprint: Blueprint = {
    children: [
        {
            translation: [5, 5, 5],
            rotation: [-0.354, 0.354, 0.146, 0.854],
            using: [camera_ortho(7, 0.1, 1000)],
        },
    ],
};
