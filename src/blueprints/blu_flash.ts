import {destroy} from "../components/com_destroy.js";
import {light} from "../components/com_light.js";
import {Blueprint} from "./blu_common";

export function create_flash() {
    return <Blueprint>{
        Using: [light([1, 1, 1], 5), destroy(0.2)],
    };
}
