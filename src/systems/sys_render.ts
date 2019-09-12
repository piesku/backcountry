import {EmitParticles} from "../components/com_emit_particles.js";
import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
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
        if ((game.World[i] & LIGHTS) == LIGHTS) {
            let transform = game[Get.Transform][i];
            let position = get_translation([], transform.World);
            light_positions.push(...position);
            light_details.push(...game[Get.Light][i]);
        }
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            if (render.Material !== current_material) {
                current_material = render.Material;
                game.GL.useProgram(current_material.Program);
                game.GL.uniformMatrix4fv(current_material.Uniforms[0], false, game.Camera!.PV);

                switch (render.Kind) {
                    case RenderKind.Instanced:
                        game.GL.uniform1i(
                            current_material.Uniforms[InstancedUniform.LightCount],
                            light_positions.length / 3
                        );
                        game.GL.uniform3fv(
                            current_material.Uniforms[InstancedUniform.LightPositions],
                            light_positions
                        );
                        game.GL.uniform4fv(
                            current_material.Uniforms[InstancedUniform.LightDetails],
                            light_details
                        );
                        break;
                }
            }

            switch (render.Kind) {
                case RenderKind.Instanced:
                    draw_instanced(game, transform, render);
                    break;
                case RenderKind.Particles: {
                    let emitter = game[Get.EmitParticles][i];
                    if (emitter.Instances.length) {
                        draw_particles(game, render, emitter);
                    }
                    break;
                }
            }
        }
    }
}

function draw_instanced(game: Game, transform: Transform, render: RenderInstanced) {
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[InstancedUniform.World],
        false,
        transform.World
    );
    game.GL.uniformMatrix4fv(
        render.Material.Uniforms[InstancedUniform.Self],
        false,
        transform.Self
    );
    game.GL.uniform3fv(
        render.Material.Uniforms[InstancedUniform.Palette],
        render.Palette || game.Palette
    );
    game.GL.bindVertexArray(render.VAO);
    game.GL.drawElementsInstanced(
        render.Material.Mode,
        render.IndexCount,
        GL_UNSIGNED_SHORT,
        0,
        render.InstanceCount
    );
    game.GL.bindVertexArray(null);
}

function draw_particles(game: Game, render: RenderParticles, emitter: EmitParticles) {
    game.GL.uniform4fv(render.Material.Uniforms[ParticleUniform.Detail], render.ColorSize);
    game.GL.bindBuffer(GL_ARRAY_BUFFER, render.Buffer);
    game.GL.bufferData(GL_ARRAY_BUFFER, Float32Array.from(emitter.Instances), GL_DYNAMIC_DRAW);
    game.GL.enableVertexAttribArray(ParticleAttribute.Origin);
    game.GL.vertexAttribPointer(ParticleAttribute.Origin, 4, GL_FLOAT, false, 4 * 4, 0);
    game.GL.drawArrays(render.Material.Mode, 0, emitter.Instances.length / 4);
}
