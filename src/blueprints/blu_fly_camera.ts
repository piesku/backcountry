import {camera_perspective} from "../components/com_camera.js";
import {fly_control} from "../components/com_control_fly.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {Blueprint} from "./blu_common";

export let fly_camera_blueprint: Blueprint = {
    rotation: [0, 1, 0, 0],
    using: [fly_control(true, true, true), move(50, 1), light([1, 1, 1], 20)],
    children: [
        {
            rotation: [0, 1, 0, 0],
            using: [camera_perspective(1, 0.1, 1000)],
        },
    ],
};
