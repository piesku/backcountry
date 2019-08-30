import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {render_vox} from "../components/com_render_vox.js";
import {integer, rand} from "../math/random.js";
import {Blueprint} from "./blu_common.js";
import {create_line} from "./blu_tools.js";

let palette = [0, 0.8, 0];

export function get_cactus_blueprint(): Blueprint {
    let height = 3 + integer(0, 4);

    // Cactuses do have trunks, right?
    let trunk = create_line([0, 1, 0], [0, height + (height < 4 ? 1 : integer(0, 4)), 0], 0);

    let branch_height = height < 4 && rand() > 0.5 ? height : 3 + integer(0, height - 4);
    let branch_length = branch_height == height && rand() > 0.5 ? 2 : 3 + integer(0, 2);

    trunk.push(
        ...create_line(
            [Math.round((branch_length - 1) / 2), branch_height, 0],
            [Math.round((branch_length - 1) / 2) - branch_length, branch_height, 0],
            0
        ),
        ...create_line(
            [Math.round((branch_length - 1) / 2), branch_height, 0],
            [
                Math.round((branch_length - 1) / 2),
                branch_height + height - ~~((rand() * height) / 2),
                0,
            ],
            0
        ),
        ...create_line(
            [Math.round((branch_length - 1) / 2) - branch_length, branch_height, 0],
            [
                Math.round((branch_length - 1) / 2) - branch_length,
                branch_height + height - ~~((rand() * height) / 2),
                0,
            ],
            0
        )
    );

    return {
        using: [
            render_vox(
                {
                    offsets: Float32Array.from(trunk),
                    size: [0, 0, 0],
                },
                palette
            ),
            cull(Get.Render),
        ],
    };
}
