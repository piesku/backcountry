import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface EmitParticles {
    readonly Lifespan: number;
    readonly Frequency: number;
    Instances: Array<number>;
    SinceLast: number;
}

/**
 * Add EMIT_PARTICLES.
 *
 * @param Lifespan How long particles live for.
 * @param Frequency How often particles spawn.
 * @param SizeStart The initial size of a particle.
 */
export function emit_particles(Lifespan: number, Frequency: number) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.EmitParticles;
        game[Get.EmitParticles][entity] = <EmitParticles>{
            Lifespan,
            Frequency,
            Instances: [],
            SinceLast: 0,
        };
    };
}
