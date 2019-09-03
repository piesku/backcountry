import {create_projectile} from "../blueprints/blu_projectile.js";
import {Anim, Animate} from "../components/com_animate.js";
import {AudioSource} from "../components/com_audio_source.js";
import {EmitParticles} from "../components/com_emit_particles.js";
import {Get} from "../components/com_index.js";
import {find_child} from "../components/com_named.js";
import {Shake} from "../components/com_shake.js";
import {Toggle} from "../components/com_toggle.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";
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
        let transform = game[Get.Transform][entity];
        let spawn = find_child(game, transform, "proj");
        if (spawn) {
            game.Add({
                ...create_projectile(),
                Translation: get_translation([], game[Get.Transform][spawn].World),
                // Use the parent's rotation, since it's top-level, to avoid
                // get_rotation which is expensive in terms of code size.
                Rotation: transform.Rotation.slice(),
            });
        }

        for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
            audio.Trigger = snd_shoot;
        }

        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Shoot;
        }

        for (let emitter of components_of_type<EmitParticles>(game, transform, Get.EmitParticles)) {
            emitter.Duration = 0.4;
        }

        for (let shake of components_of_type<Shake>(game, transform, Get.Shake)) {
            shake.Duration = 0.4;
        }

        for (let toggle of components_of_type<Toggle>(game, transform, Get.Toggle)) {
            toggle.Duration = 0.4;
        }

        game[Get.Shake][game.Cameras[0].Entity].Duration = 0.2;
    }

    shoot.Target = null;
}
