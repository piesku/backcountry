import {collide} from "../components/com_collide.js";
import {move} from "../components/com_move.js";
import {projectile} from "../components/com_projectile.js";
import {render_vox} from "../components/com_render_vox.js";
import {Blueprint} from "./blu_common";

export function create_projectile() {
    return <Blueprint>{
        Using: [
            collide(true),
            projectile(1, 5),
            move(40),
            render_vox({Offsets: new Float32Array(4), Size: [1, 1, 1]}, [1, 0, 0]),
        ],
    };
}
