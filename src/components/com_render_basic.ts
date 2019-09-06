import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Vec4} from "../math/index.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW} from "../webgl.js";
import {Get} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderBasic {
    readonly Kind: RenderKind.Basic;
    readonly Material: Material;
    readonly VAO: WebGLVertexArrayObject;
    readonly Count: number;
    Color: Vec4;
}

let vaos: WeakMap<Shape, WebGLVertexArrayObject> = new WeakMap();

export function render_basic(Material: Material, shape: Shape, Color: Vec4) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(shape)) {
            // We only need to create the VAO once.
            vaos.set(shape, buffer(game.GL, shape)!);
        }

        game.World[entity] |= 1 << Get.Render;
        game[Get.Render][entity] = <RenderBasic>{
            Kind: RenderKind.Basic,
            Material,
            VAO: vaos.get(shape),
            Count: shape.Indices.length,
            Color,
        };
    };
}

export const enum BasicAttribute {
    position = 1,
}

function buffer(gl: WebGL2RenderingContext, shape: Shape) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ARRAY_BUFFER, shape.Vertices, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(BasicAttribute.position);
    gl.vertexAttribPointer(BasicAttribute.position, 3, GL_FLOAT, false, 0, 0);

    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, shape.Indices, GL_STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
