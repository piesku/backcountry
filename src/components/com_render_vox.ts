import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Mat} from "../materials/mat_index.js";
import {Model} from "../model.js";
import {Cube} from "../shapes/Cube.js";
import {Get} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderInstanced {
    readonly kind: RenderKind.Instanced;
    readonly material: Material;
    readonly vao: WebGLVertexArrayObject;
    readonly index_count: number;
    readonly instance_count: number;
}

export function render_vox(model: Model) {
    let {offsets} = model;
    let shape = Cube;
    return (game: Game) => (entity: Entity) => {
        let vao = buffer(game.gl, shape, offsets);
        let material = game.materials[Mat.Instanced];

        game.world[entity] |= 1 << Get.Render;
        game[Get.Render][entity] = <RenderInstanced>{
            kind: RenderKind.Instanced,
            material,
            vao,
            index_count: shape.indices.length,
            instance_count: offsets.length / 4,
        };
    };
}

export const enum InstancedAttribute {
    position = 1,
    normal = 2,
    offset = 3,
}

function buffer(gl: WebGL2RenderingContext, shape: Shape, offsets: Float32Array) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(InstancedAttribute.position);
    gl.vertexAttribPointer(InstancedAttribute.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, shape.normals, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(InstancedAttribute.normal);
    gl.vertexAttribPointer(InstancedAttribute.normal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(InstancedAttribute.offset);
    gl.vertexAttribPointer(InstancedAttribute.offset, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(InstancedAttribute.offset, 1);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shape.indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
