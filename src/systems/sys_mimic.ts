import {Get, Has} from "../components/com_index.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
import {lerp as lerp_vec3} from "../math/vec3.js";

const QUERY = Has.Transform | Has.Mimic;

export function sys_mimic(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            let follower_transform = game[Get.Transform][i];
            let follower_mimic = game[Get.Mimic][i];
            let target_transform = game[Get.Transform][follower_mimic.Target];
            let target_world_position = get_translation([], target_transform.World);
            // XXX Follower must be a top-level transform for this to work.
            follower_transform.Translation = lerp_vec3(
                [],
                follower_transform.Translation,
                target_world_position,
                0.1
            );
            follower_transform.Dirty = true;
        }
    }
}
