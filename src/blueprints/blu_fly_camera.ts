import {camera_perspective} from "../components/com_camera.js";
import {fly_control} from "../components/com_control_fly.js";
import {move} from "../components/com_move.js";
import {Blueprint} from "./blu_common";

export let fly_camera_blueprint: Blueprint = {
    rotation: [0, 1, 0, 0],
    using: [fly_control(true, true, true), move(50, 0.2)],
    children: [
        {
            rotation: [0, 1, 0, 0],
            using: [camera_perspective(1, 0.1, 1000)],
        },
    ],
};
