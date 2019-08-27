import {Get} from "../components/com_index.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {lerp as lerp_vec3} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Mimic);

export function sys_mimic(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let follower_transform = game[Get.Transform][i];
            let follower_mimic = game[Get.Mimic][i];
            let target_transform = game[Get.Transform][follower_mimic.target];
            let target_world_position = get_translation([], target_transform.world);
            // XXX Follower must be a top-level transform for this to work.
            follower_transform.translation = lerp_vec3(
                [],
                follower_transform.translation,
                target_world_position,
                follower_mimic.stiffness
            );
            follower_transform.dirty = true;
        }
    }
}
