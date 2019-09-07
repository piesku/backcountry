import {Particle} from "../components/com_emit_particles.js";
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
        let particle = <Particle>{Origin: [0, 0, 0], Age: 0};
        get_translation(particle.Origin, transform.World);
        emitter.Particles.push(particle);
    }

    // A flat continuous array of particle data, from which a Float32Array
    // is created in sys_render and sent as a vertex attribute array.
    emitter.Instances = [];
    for (let i = 0; i < emitter.Particles.length; ) {
        let particle = emitter.Particles[i];
        particle.Age += delta;
        if (particle.Age > emitter.Lifespan) {
            emitter.Particles.shift();
        } else {
            emitter.Instances.push(...particle.Origin, particle.Age / emitter.Lifespan);
            i++;
        }
    }
}
