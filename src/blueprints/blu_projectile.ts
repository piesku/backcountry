import {collide} from "../components/com_collide.js";
import {emit_particles} from "../components/com_emit_particles.js";
import {light} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {projectile} from "../components/com_projectile.js";
import {render_particles} from "../components/com_render_particles.js";
import {render_vox} from "../components/com_render_vox.js";
import {shake} from "../components/com_shake.js";
import {Blueprint} from "./blu_common";

export function create_projectile() {
    return <Blueprint>{
        Using: [collide(true), projectile(1, 5), move(40), light([1, 1, 0], 2)],
        Children: [
            {
                Scale: [0.3, 0.3, 0.3],
                Using: [
                    render_vox(
                        {
                            Offsets: new Float32Array(4),
                            // Size: [1, 1, 1]
                        },
                        [1, 0, 0]
                    ),
                ],
            },
            {
                Using: [shake(5), emit_particles(1, 0.08, 5), render_particles([1, 0, 0], 9)],
            },
        ],
    };
}
