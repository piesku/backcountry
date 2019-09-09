import {Entity, Game} from "../game.js";
import {Material} from "../materials/mat_common.js";
import {Mat} from "../materials/mat_index.js";
import {Vec3, Vec4} from "../math/index.js";
import {Get} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderParticles {
    readonly Kind: RenderKind.Particles;
    readonly Material: Material;
    readonly Buffer: WebGLBuffer;
    readonly ColorSize: Vec4;
}

export function render_particles(color: Vec3, size: number) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Render;
        game[Get.Render][entity] = <RenderParticles>{
            Kind: RenderKind.Particles,
            Material: game.Materials[Mat.Particles],
            Buffer: game.GL.createBuffer(),
            ColorSize: [...color, size],
        };
    };
}

export const enum ParticleAttribute {
    Origin = 1,
}

export const enum ParticleUniform {
    PV,
    Detail,
}
