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
    game.Targets = [];
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & TARGET) === TARGET) {
            game.Targets.push(game[Get.RayTarget][i]);
        }
    }

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];
    let select = game[Get.Select][entity];

    let x = (game.Input.mx / game.Canvas.width) * 2 - 1;
    // In the browser, +Y is down. Invert it, so that in NDC it's up.
    let y = -(game.Input.my / game.Canvas.height) * 2 + 1;
    let origin = [x, y, -1];
    let target = [x, y, 1];
    let direction = [0, 0, 0];

    transform_point(origin, origin, camera.Unproject);
    transform_point(origin, origin, transform.World);
    transform_point(target, target, camera.Unproject);
    transform_point(target, target, transform.World);
    subtract(direction, target, origin);
    normalize(direction, direction);
    select.Hit = raycast(game, origin, direction);

    if (select.Hit && select.Hit.Other.Flags & ANIMATED && (game.Event.m0d || game.Event.m2d)) {
        let transform = game[Get.Transform][select.Hit.Other.Entity];
        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Select;
        }
        for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
            audio.Trigger = snd_click;
        }
    }
}
