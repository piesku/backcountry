import {Action} from "../actions.js";
import {Anim, Animate} from "../components/com_animate.js";
import {AudioSource} from "../components/com_audio_source.js";
import {EmitParticles} from "../components/com_emit_particles.js";
import {Get} from "../components/com_index.js";
import {RayFlag} from "../components/com_ray_target.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {get_forward, get_translation} from "../math/mat4.js";
import {raycast} from "../math/raycast.js";
import {snd_miss} from "../sounds/snd_miss.js";
import {snd_shoot} from "../sounds/snd_shoot.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Shoot);

export function sys_shoot(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shoot = game[Get.Shoot][entity];
    if (shoot.Target) {
        console.log(`Shot fired at ${shoot.Target}`);

        // TODO Emit particles.
        // TODO Add other effects.

        let transform = game[Get.Transform][entity];
        let origin = get_translation([], transform.World);
        let direction = get_forward([], transform.World);
        let hit = raycast(game, origin, direction);
        if (hit && hit.Other.Flags & RayFlag.Attackable) {
            let health = game[Get.Health][hit.Other.Entity];
            health.Damages.push(shoot.Damage);
            game.Dispatch(Action.HitEnemy, hit.Other.Entity);
            for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
                audio.Trigger = snd_shoot;
            }
        } else {
            for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
                audio.Trigger = snd_miss;
            }
        }

        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Shoot;
        }

        for (let emitter of components_of_type<EmitParticles>(game, transform, Get.EmitParticles)) {
            emitter.Time = 0.2;
        }
    }

    shoot.Target = null;
}
