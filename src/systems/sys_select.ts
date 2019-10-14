import {Anim, Animate} from "../components/com_animate.js";
import {AudioSource} from "../components/com_audio_source.js";
import {Collide, RayTarget} from "../components/com_collide.js";
import {Get, Has} from "../components/com_index.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {raycast_aabb} from "../math/raycast.js";
import {add, normalize, scale, subtract, transform_point} from "../math/vec3.js";
import {snd_click} from "../sounds/snd_click.js";

const QUERY = Has.Transform | Has.Camera | Has.Select;
const TARGET = Has.Transform | Has.Collide;
const ANIMATED = RayTarget.Navigable | RayTarget.Player;

export function sys_select(game: Game, delta: number) {
    let colliders: Array<Collide> = [];
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & TARGET) == TARGET) {
            if (game[Get.Collide][i].Flags !== RayTarget.None) {
                colliders.push(game[Get.Collide][i]);
            }
        }
    }

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i, colliders);
        }
    }
}

function update(game: Game, entity: Entity, colliders: Array<Collide>) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];
    let select = game[Get.Select][entity];

    let x = (game.Input.mx / game.Canvas3.width) * 2 - 1;
    // In the browser, +Y is down. Invert it, so that in NDC it's up.
    let y = -(game.Input.my / game.Canvas3.height) * 2 + 1;
    let origin = [x, y, -1];
    let target = [x, y, 1];
    let direction = [0, 0, 0];

    transform_point(origin, origin, camera.Unproject);
    transform_point(origin, origin, transform.World);
    transform_point(target, target, camera.Unproject);
    transform_point(target, target, transform.World);
    subtract(direction, target, origin);
    normalize(direction, direction);
    select.Hit = raycast_aabb(colliders, origin, direction);

    // Check where the ray intersects the {point: [0, 5, 0], normal: [0, 1, 0]}
    // plane, i.e. the plane on which player's projectiles move.
    let t = (5 - origin[1]) / direction[1];
    add(select.Position, origin, scale(direction, direction, t));

    if (select.Hit && select.Hit.Flags & ANIMATED && game.Input.d0) {
        let transform = game[Get.Transform][select.Hit.EntityId];
        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Select;
        }
        for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
            audio.Trigger = snd_click;
        }
    }
}
