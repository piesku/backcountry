import {RenderParticles} from "./com_render_particles.js";
import {RenderInstanced} from "./com_render_vox.js";

export type Render = RenderInstanced | RenderParticles;

export const enum RenderKind {
    Instanced,
    Particles,
}
