import {Particle} from "../components/com_emit_particles.js";
import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.EmitParticles);

export function sys_particles(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let emitter = game[Get.EmitParticles][entity];
    let transform = game[Get.Transform][entity];

    emitter.since_last += delta;
    if (emitter.time > 0 && emitter.since_last > emitter.frequency) {
        emitter.time -= delta;
        emitter.since_last = 0;
        let particle = <Particle>{id: Math.random(), origin: [0, 0, 0], age: 0};
        get_translation(particle.origin, transform.world);
        emitter.particles.push(particle);
    }

    // A flat continuous array of particle data, from which a Float32Array
    // is created in sys_render and sent as a vertex attribute array.
    emitter.instances = [];
    for (let i = 0; i < emitter.particles.length; ) {
        let particle = emitter.particles[i];
        particle.age += delta;
        if (particle.age > emitter.lifespan) {
            emitter.particles.shift();
        } else {
            emitter.instances.push(
                particle.id,
                ...particle.origin,
                particle.age / emitter.lifespan
            );
            i++;
        }
    }
}
