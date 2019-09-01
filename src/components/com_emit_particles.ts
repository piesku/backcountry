import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface EmitParticles {
    readonly Lifespan: number;
    readonly Frequency: number;
    readonly Size: number;
    readonly Vertical: number;
    Time: number;
    Particles: Array<Particle>;
    Instances: Array<number>;
    SinceLast: number;
}

/**
 * Add EMIT_PARTICLES.
 *
 * @param Lifespan How long particles live for.
 * @param Frequency How often particles spawn.
 * @param Size The initial size of a particle.
 * @param Vertical The Y distance particles will travel in their lifetime.
 * @param Time How long to emit for. Can
 */
export function emit_particles(
    Lifespan: number,
    Frequency: number,
    Size: number,
    Vertical: number,
    Time: number = 0
) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.EmitParticles;
        game[Get.EmitParticles][entity] = <EmitParticles>{
            Lifespan,
            Frequency,
            Size,
            Vertical,
            Time,
            Particles: [],
            Instances: [],
            SinceLast: 0,
        };
    };
}

export interface Particle {
    readonly Id: number;
    readonly Origin: Vec3;
    Age: number;
}
