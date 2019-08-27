import {Entity, Game} from "../game.js";
import {Material} from "../materials/mat_common.js";
import {Mat} from "../materials/mat_index.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderParticles {
    readonly kind: RenderKind.Particles;
    readonly material: Material;
    readonly buffer: WebGLBuffer;
    start_color: Vec3;
    end_color: Vec3;
}

export function render_particles(start_color: Vec3, end_color: Vec3) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Render;
        game[Get.Render][entity] = <RenderParticles>{
            kind: RenderKind.Particles,
            material: game.materials[Mat.Particles],
            buffer: game.gl.createBuffer(),
            start_color,
            end_color,
        };
    };
}
