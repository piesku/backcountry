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
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shoot = game[Get.Shoot][entity];
    if (shoot.target) {
        console.log(`Shot fired at ${shoot.target}`);

        // TODO Emit particles.
        // TODO Add other effects.

        let transform = game[Get.Transform][entity];
        let origin = get_translation([], transform.world);
        let direction = get_forward([], transform.world);
        let hit = raycast(game, origin, direction);
        if (hit && hit.other.flags & RayFlag.Attackable) {
            let health = game[Get.Health][hit.other.entity];
            health.damages.push(shoot.damage);
            game.dispatch(Action.HitEnemy, hit.other.entity);
            for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
                audio.trigger = snd_shoot;
            }
        } else {
            for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
                audio.trigger = snd_miss;
            }
        }

        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.trigger = Anim.Shoot;
        }

        for (let emitter of components_of_type<EmitParticles>(game, transform, Get.EmitParticles)) {
            emitter.time = 0.2;
        }
    }

    shoot.target = null;
}
