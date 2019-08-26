import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {RenderInstanced} from "../components/com_render_vox.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Render);

export function sys_render(game: Game, delta: number) {
    game.gl.clear(game.gl.COLOR_BUFFER_BIT | game.gl.DEPTH_BUFFER_BIT);

    let light_positions: Array<number> = [];
    let light_details: Array<number> = [];

    for (let i = 0; i < game.lights.length; i++) {
        let light = game.lights[i];
        let transform = game[Get.Transform][light.entity];
        let position = get_translation([], transform.world);
        light_positions.push(...position);
        light_details.push(...light.color, light.intensity);
    }

    // Keep track of the current material to minimize switching.
    let current_material = null;

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let render = game[Get.Render][i];

            // TODO Sort by material.
            if (render.material !== current_material) {
                current_material = render.material;

                let {gl, program, uniforms} = current_material;
                gl.useProgram(program);
                // TODO Support more than one camera.
                gl.uniformMatrix4fv(uniforms.pv, false, game.cameras[0].pv);

                switch (render.kind) {
                    case RenderKind.Instanced:
                        gl.uniform1i(uniforms.light_count, game.lights.length);
                        gl.uniform3fv(uniforms.light_positions, light_positions);
                        gl.uniform4fv(uniforms.light_details, light_details);
                        break;
                }
            }

            switch (render.kind) {
                case RenderKind.Instanced:
                    draw_instanced(game, transform, render);
                    break;
            }
        }
    }
}

function draw_instanced(game: Game, transform: Transform, render: RenderInstanced) {
    let {gl, mode, uniforms} = render.material;
    gl.uniformMatrix4fv(uniforms.world, false, transform.world);
    gl.uniformMatrix4fv(uniforms.self, false, transform.self);
    gl.uniform3fv(uniforms.palette, render.palette || game.palette);
    gl.bindVertexArray(render.vao);
    gl.drawElementsInstanced(mode, render.index_count, gl.UNSIGNED_SHORT, 0, render.instance_count);
    gl.bindVertexArray(null);
}
