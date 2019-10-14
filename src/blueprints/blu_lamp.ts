import {cull} from "../components/com_cull.js";
import {Has} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {render_vox} from "../components/com_render_vox.js";
import {Blueprint} from "./blu_common.js";

export function create_lamp() {
    return <Blueprint>{
        Children: [
            {
                Translation: [0, 0, 4],
                Using: [render_vox(new Float32Array(4), [1, 0.5, 0]), cull(Has.Render)],
            },
            {
                Translation: [0, 1, 7],
                Using: [cull(Has.Light), light([1, 0.5, 0], 5)],
            },
        ],
    };
}
