import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.EmitParticles);

export function sys_particles(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let emitter = game[Get.EmitParticles][entity];
    let transform = game[Get.Transform][entity];

    emitter.SinceLast += delta;
    if (emitter.SinceLast > emitter.Frequency) {
        emitter.SinceLast = 0;
        let origin = get_translation([], transform.World);
        // Push [x, y, z, age].
        emitter.Instances.push(...origin, 0);
    }

    // A flat continuous array of particle data, from which a Float32Array
    // is created in sys_render and sent as a vertex attribute array.
    for (let i = 0; i < emitter.Instances.length; ) {
        emitter.Instances[i + 3] += delta / emitter.Lifespan;
        if (emitter.Instances[i + 3] > 1) {
            emitter.Instances.splice(i, 4);
        } else {
            i += 4;
        }
    }
}
