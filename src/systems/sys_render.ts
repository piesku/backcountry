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
import {GL_ARRAY_BUFFER, GL_DYNAMIC_DRAW, GL_FLOAT, GL_UNSIGNED_SHORT} from "../webgl.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Render);

export function sys_render(game: Game, delta: number) {
    game.GL.clear(game.GL.COLOR_BUFFER_BIT | game.GL.DEPTH_BUFFER_BIT);

    let light_positions: Array<number> = [];
    let light_details: Array<number> = [];

    for (let i = 0; i < game.Lights.length; i++) {
        let light = game.Lights[i];
        let transform = game[Get.Transform][light.Entity];
        let position = get_translation([], transform.World);
        light_positions.push(...position);
        light_details.push(...light.Color, light.Intensity);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            // TODO Sort by material.
            if (render.Material !== current_material) {
                current_material = render.Material;

                let {gl, program, uniforms} = current_material;
                gl.useProgram(program);
                // TODO Support more than one camera.
                gl.uniformMatrix4fv(uniforms.pv, false, game.Cameras[0].PV);

                switch (render.Kind) {
                    case RenderKind.Instanced:
                        gl.uniform1i(uniforms.light_count, game.Lights.length);
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
    gl.uniform1f(uniforms.start_size, emitter.SizeStart);
    gl.uniform1f(uniforms.end_size, emitter.SizeEnd);
    gl.uniform1f(uniforms.vertical, emitter.Vertical);
    gl.uniform3fv(uniforms.start_color, render.ColorStart);
    gl.uniform3fv(uniforms.end_color, render.ColorEnd);

    gl.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    gl.bufferData(GL_ARRAY_BUFFER, Float32Array.from(emitter.Instances), GL_DYNAMIC_DRAW);
    gl.enableVertexAttribArray(ParticleAttribute.id);
    gl.vertexAttribPointer(1, 1, GL_FLOAT, false, 5 * 4, 0);
    gl.enableVertexAttribArray(ParticleAttribute.origin);
    gl.vertexAttribPointer(2, 3, GL_FLOAT, false, 5 * 4, 1 * 4);
    gl.enableVertexAttribArray(ParticleAttribute.age);
    gl.vertexAttribPointer(3, 1, GL_FLOAT, false, 5 * 4, 4 * 4);
    gl.drawArrays(mode, 0, emitter.Particles.length);
}
