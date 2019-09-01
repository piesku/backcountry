import {Anim, Animate} from "../components/com_animate.js";
import {AudioSource} from "../components/com_audio_source.js";
import {Get} from "../components/com_index.js";
import {RayFlag} from "../components/com_ray_target.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {raycast} from "../math/raycast.js";
import {normalize, subtract, transform_point} from "../math/vec3.js";
import {snd_click} from "../sounds/snd_click.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Camera) | (1 << Get.Select);
const TARGET = (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.RayTarget);
const ANIMATED = RayFlag.Navigable | RayFlag.Player;

export function sys_select(game: Game, delta: number) {
    game.targets = [];
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & TARGET) === TARGET) {
            game.targets.push(game[Get.RayTarget][i]);
        }
    }

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];
    let select = game[Get.Select][entity];

    let x = (game.input.mouse_x / game.canvas.width) * 2 - 1;
    // In the browser, +Y is down. Invert it, so that in NDC it's up.
    let y = -(game.input.mouse_y / game.canvas.height) * 2 + 1;
    let origin = [x, y, -1];
    let target = [x, y, 1];
    let direction = [0, 0, 0];

    transform_point(origin, origin, camera.unproject);
    transform_point(origin, origin, transform.world);
    transform_point(target, target, camera.unproject);
    transform_point(target, target, transform.world);
    subtract(direction, target, origin);
    normalize(direction, direction);
    select.hit = raycast(game, origin, direction);

    if (
        select.hit &&
        select.hit.other.flags & ANIMATED &&
        (game.event.mouse_0_down || game.event.mouse_2_down)
    ) {
        let transform = game[Get.Transform][select.hit.other.entity];
        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Select;
        }
        for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
            audio.Trigger = snd_click;
        }
    }
}
