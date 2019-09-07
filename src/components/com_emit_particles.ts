import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface EmitParticles {
    readonly Lifespan: number;
    readonly Frequency: number;
    Duration: number;
    Particles: Array<Particle>;
    Instances: Array<number>;
    SinceLast: number;
}

/**
 * Add EMIT_PARTICLES.
 *
 * @param Lifespan How long particles live for.
 * @param Frequency How often particles spawn.
 * @param SizeStart The initial size of a particle.
 * @param Duration How long to emit for.
 */
export function emit_particles(Lifespan: number, Frequency: number, Duration: number = 0) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.EmitParticles;
        game[Get.EmitParticles][entity] = <EmitParticles>{
            Lifespan,
            Frequency,
            Duration,
            Particles: [],
            Instances: [],
            SinceLast: 0,
        };
    };
}

export interface Particle {
    readonly Origin: Vec3;
    Age: number;
}
