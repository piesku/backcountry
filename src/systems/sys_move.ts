import {Anim, Animate} from "../components/com_animate.js";
import {Get} from "../components/com_index.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {multiply} from "../math/quat.js";
import {add, scale} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Move);

export function sys_move(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let move = game[Get.Move][entity];

    if (move.Direction) {
        scale(move.Direction, move.Direction, move.MoveSpeed * delta);
        add(transform.Translation, transform.Translation, move.Direction);
        transform.Dirty = true;
        move.Direction = undefined;
        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Move;
        }
    } else {
        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Idle;
        }
    }

    if (move.Yaw) {
        // Yaw is applied relative to the world space.
        multiply(transform.Rotation, move.Yaw, transform.Rotation);
        transform.Dirty = true;
        move.Yaw = undefined;
    }
}
