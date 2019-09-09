import {create_flash} from "../blueprints/blu_flash.js";
import {create_projectile} from "../blueprints/blu_projectile.js";
import {Anim, Animate} from "../components/com_animate.js";
import {AudioSource} from "../components/com_audio_source.js";
import {Get} from "../components/com_index.js";
import {find_child} from "../components/com_named.js";
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
            let projectile =
                game.World[entity] & (1 << Get.PlayerControl)
                    ? create_projectile(500, 40, [1, 1, 1], 9)
                    : create_projectile(300, 30, [1, 0, 0], 7);
            let Translation = get_translation([], game[Get.Transform][spawn].World);
            game.Add({
                ...projectile,
                Translation,
                // Use the parent's rotation, since it's top-level, to avoid
                // get_rotation which is expensive in terms of code size.
                Rotation: transform.Rotation.slice(),
            });
            game.Add({
                ...create_flash(),
                Translation,
            });
        }

        for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
            audio.Trigger = snd_shoot;
        }

        for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
            animate.Trigger = Anim.Shoot;
        }
    }

    shoot.Target = null;
}
