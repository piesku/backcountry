import {RenderBasic} from "./com_render_basic.js";
import {RenderParticles} from "./com_render_particles.js";
import {RenderShaded} from "./com_render_shaded.js";
import {RenderInstanced} from "./com_render_vox.js";

export type Render = RenderBasic | RenderShaded | RenderInstanced | RenderParticles;

export const enum RenderKind {
    Basic,
    Shaded,
    Instanced,
    Particles,
}
