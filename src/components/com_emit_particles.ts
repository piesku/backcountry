import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface EmitParticles {
    readonly Lifespan: number;
    readonly Frequency: number;
    readonly SizeStart: number;
    readonly SizeEnd: number;
    readonly Vertical: number;
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
 * @param SizeEnd The final size of a particle.
 * @param Vertical The Y distance particles will travel in their lifetime.
 * @param Time How long to emit for. Can
 */
export function emit_particles(
    Lifespan: number,
    Frequency: number,
    SizeStart: number,
    SizeEnd: number,
    Vertical: number,
    Time: number = 0
) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.EmitParticles;
        game[Get.EmitParticles][entity] = <EmitParticles>{
            Lifespan,
            Frequency,
            SizeStart,
            SizeEnd,
            Vertical,
            Duration: Time,
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
