import {lifespan} from "../components/com_lifespan.js";
import {light} from "../components/com_light.js";
import {Blueprint} from "./blu_common";

export function create_flash() {
    return <Blueprint>{
        Using: [light([1, 1, 1], 5), lifespan(0.2)],
    };
}
