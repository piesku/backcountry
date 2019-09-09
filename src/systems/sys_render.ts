import {EmitParticles} from "../components/com_emit_particles.js";
import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {BasicUniform, RenderBasic} from "../components/com_render_basic.js";
import {
    ParticleAttribute,
    ParticleUniform,
    RenderParticles,
} from "../components/com_render_particles.js";
import {InstancedUniform, RenderInstanced} from "../components/com_render_vox.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
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

                let {GL: gl, Program: program, Uniforms: uniforms} = current_material;
                gl.useProgram(program);
                gl.uniformMatrix4fv(uniforms[0], false, game.Camera!.PV);

                switch (render.Kind) {
                    case RenderKind.Instanced:
                        gl.uniform1i(
                            uniforms[InstancedUniform.LightCount],
                            light_positions.length / 3
                        );
                        gl.uniform3fv(uniforms[InstancedUniform.LightPositions], light_positions);
                        gl.uniform4fv(uniforms[InstancedUniform.LightDetails], light_details);
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
    let {GL, Mode, Uniforms} = render.Material;
    GL.uniformMatrix4fv(Uniforms[BasicUniform.World], false, transform.World);
    GL.uniform4fv(Uniforms[BasicUniform.Color], render.Color);
    GL.bindVertexArray(render.VAO);
    GL.drawElements(Mode, render.Count, GL_UNSIGNED_SHORT, 0);
    GL.bindVertexArray(null);
}

function draw_instanced(game: Game, transform: Transform, render: RenderInstanced) {
    let {GL, Mode, Uniforms} = render.Material;
    GL.uniformMatrix4fv(Uniforms[InstancedUniform.World], false, transform.World);
    GL.uniformMatrix4fv(Uniforms[InstancedUniform.Self], false, transform.Self);
    GL.uniform3fv(Uniforms[InstancedUniform.Palette], render.Palette || game.Palette);
    GL.bindVertexArray(render.VAO);
    GL.drawElementsInstanced(Mode, render.IndexCount, GL_UNSIGNED_SHORT, 0, render.InstanceCount);
    GL.bindVertexArray(null);
}

function draw_particles(render: RenderParticles, emitter: EmitParticles) {
    let {GL, Mode, Uniforms} = render.Material;
    GL.uniform4fv(Uniforms[ParticleUniform.Detail], render.ColorSize);
    GL.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    GL.bufferData(GL_ARRAY_BUFFER, Float32Array.from(emitter.Instances), GL_DYNAMIC_DRAW);
    GL.enableVertexAttribArray(ParticleAttribute.Origin);
    GL.vertexAttribPointer(ParticleAttribute.Origin, 4, GL_FLOAT, false, 4 * 4, 0);
    GL.drawArrays(Mode, 0, emitter.Instances.length / 4);
}
