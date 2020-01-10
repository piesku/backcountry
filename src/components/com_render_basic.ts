import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Vec4} from "../math/index.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW} from "../webgl.js";
import {Get, Has} from "./com_index.js";
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
            // We only need to create the VAO once per shape.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, game.GL.createBuffer());
            game.GL.bufferData(GL_ARRAY_BUFFER, shape.Vertices, GL_STATIC_DRAW);
            game.GL.enableVertexAttribArray(BasicAttribute.Position);
            game.GL.vertexAttribPointer(BasicAttribute.Position, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, game.GL.createBuffer());
            game.GL.bufferData(GL_ELEMENT_ARRAY_BUFFER, shape.Indices, GL_STATIC_DRAW);

            game.GL.bindVertexArray(null);
            vaos.set(shape, vao);
        }

        game.World[entity] |= Has.Render;
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
    Position = 1,
}

export const enum BasicUniform {
    PV,
    World,
    Color,
}
