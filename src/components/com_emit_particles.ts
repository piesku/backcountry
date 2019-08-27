import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface EmitParticles {
    readonly lifespan: number;
    readonly frequency: number;
    readonly size: number;
    readonly vertical: number;
    time: number;
    particles: Array<Particle>;
    instances: Array<number>;
    since_last: number;
}

/**
 * Add EMIT_PARTICLES.
 *
 * @param lifespan How long particles live for.
 * @param frequency How often particles spawn.
 * @param size The initial size of a particle.
 * @param vertical The Y distance particles will travel in their lifetime.
 * @param time How long to emit for. Can
 */
export function emit_particles(
    lifespan: number,
    frequency: number,
    size: number,
    vertical: number,
    time: number = 0
) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.EmitParticles;
        game[Get.EmitParticles][entity] = <EmitParticles>{
            lifespan,
            frequency,
            size,
            vertical,
            time,
            particles: [],
            instances: [],
            since_last: 0,
        };
    };
}

export interface Particle {
    readonly id: number;
    readonly origin: Vec3;
    age: number;
}
