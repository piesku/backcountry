import {RenderBasic} from "./com_render_basic.js";
import {RenderParticles} from "./com_render_particles.js";
import {RenderInstanced} from "./com_render_vox.js";

export type Render = RenderBasic | RenderInstanced | RenderParticles;

export const enum RenderKind {
    Basic,
    Instanced,
    Particles,
}
