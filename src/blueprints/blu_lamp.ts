import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {render_vox} from "../components/com_render_vox.js";
import {Blueprint} from "./blu_common.js";

export function create_lamp() {
    return <Blueprint>{
        Children: [
            {
                Translation: [0, 0, 4],
                Using: [
                    render_vox(
                        {
                            Offsets: new Float32Array(4),
                        },
                        [1, 0.5, 0]
                    ),
                    cull(Get.Render),
                ],
            },
            {
                Translation: [0, 1, 7],
                Using: [cull(Get.Light), light([1, 0.5, 0], 5)],
            },
        ],
    };
}
