import {EmitParticles} from "../components/com_emit_particles.js";
import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderBasic} from "../components/com_render_basic.js";
import {RenderParticles} from "../components/com_render_particles.js";
import {RenderInstanced} from "../components/com_render_vox.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {ParticleAttribute} from "../materials/mat_particles.js";
import {get_translation} from "../math/mat4.js";
import {
    GL_ARRAY_BUFFER,
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_DYNAMIC_DRAW,
    GL_FLOAT,
    GL_UNSIGNED_SHORT,
} from "../webgl.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Render);
const LIGHTS = (1 << Get.Transform) | (1 << Get.Light);

export function sys_render(game: Game, delta: number) {
    game.GL.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    let light_positions: Array<number> = [];
    let light_details: Array<number> = [];

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & LIGHTS) === LIGHTS) {
            let transform = game[Get.Transform][i];
            let position = get_translation([], transform.World);
            light_positions.push(...position);
            light_details.push(...game[Get.Light][i]);
        }
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            if (render.Material !== current_material) {
                current_material = render.Material;

                let {gl, program, uniforms} = current_material;
                gl.useProgram(program);
                gl.uniformMatrix4fv(uniforms.pv, false, game.Camera!.PV);

                switch (render.Kind) {
                    case RenderKind.Instanced:
                        gl.uniform1i(uniforms.light_count, light_positions.length / 3);
                        gl.uniform3fv(uniforms.light_positions, light_positions);
                        gl.uniform4fv(uniforms.light_details, light_details);
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.Basic:
                    draw_basic(transform, render);
                    break;
                case RenderKind.Instanced:
                    draw_instanced(game, transform, render);
                    break;
                case RenderKind.Particles: {
                    let emitter = game[Get.EmitParticles][i];
                    if (emitter.Instances.length) {
                        draw_particles(render, emitter);
                    }
                    break;
                }
            }
        }
    }
}

function draw_basic(transform: Transform, render: RenderBasic) {
    let {gl, mode, uniforms} = render.Material;
    gl.uniformMatrix4fv(uniforms.world, false, transform.World);
    gl.uniform4fv(uniforms.color, render.Color);
    gl.bindVertexArray(render.VAO);
    gl.drawElements(mode, render.Count, GL_UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}

function draw_instanced(game: Game, transform: Transform, render: RenderInstanced) {
    let {gl, mode, uniforms} = render.Material;
    gl.uniformMatrix4fv(uniforms.world, false, transform.World);
    gl.uniformMatrix4fv(uniforms.self, false, transform.Self);
    gl.uniform3fv(uniforms.palette, render.Palette || game.Palette);
    gl.bindVertexArray(render.VAO);
    gl.drawElementsInstanced(mode, render.IndexCount, GL_UNSIGNED_SHORT, 0, render.InstanceCount);
    gl.bindVertexArray(null);
}

function draw_particles(render: RenderParticles, emitter: EmitParticles) {
    let {gl, mode, uniforms} = render.Material;
    gl.uniform4fv(uniforms.detail, render.ColorSize);
    gl.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    gl.bufferData(GL_ARRAY_BUFFER, Float32Array.from(emitter.Instances), GL_DYNAMIC_DRAW);
    gl.enableVertexAttribArray(ParticleAttribute.origin);
    gl.vertexAttribPointer(ParticleAttribute.origin, 4, GL_FLOAT, false, 4 * 4, 0);
    gl.drawArrays(mode, 0, emitter.Instances.length / 4);
}
