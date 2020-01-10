import {Entity, Game} from "../game.js";
import {Material} from "../materials/mat_common.js";
import {Mat} from "../materials/mat_index.js";
import {Model} from "../model.js";
import {Cube} from "../shapes/Cube.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW} from "../webgl.js";
import {Get, Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderInstanced {
    readonly Kind: RenderKind.Instanced;
    readonly Material: Material;
    readonly VAO: WebGLVertexArrayObject;
    readonly IndexCount: number;
    readonly InstanceCount: number;
    readonly Palette?: Array<number>;
}

export function render_vox(model: Model, Palette?: Array<number>) {
    return (game: Game, entity: Entity) => {
        let VAO = game.GL.createVertexArray();
        game.GL.bindVertexArray(VAO);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, game.GL.createBuffer());
        game.GL.bufferData(GL_ARRAY_BUFFER, Cube.Vertices, GL_STATIC_DRAW);
        game.GL.enableVertexAttribArray(InstancedAttribute.Position);
        game.GL.vertexAttribPointer(InstancedAttribute.Position, 3, GL_FLOAT, false, 0, 0);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, game.GL.createBuffer());
        game.GL.bufferData(GL_ARRAY_BUFFER, Cube.Normals, GL_STATIC_DRAW);
        game.GL.enableVertexAttribArray(InstancedAttribute.Normal);
        game.GL.vertexAttribPointer(InstancedAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, game.GL.createBuffer());
        game.GL.bufferData(GL_ARRAY_BUFFER, model, GL_STATIC_DRAW);
        game.GL.enableVertexAttribArray(InstancedAttribute.Offset);
        game.GL.vertexAttribPointer(InstancedAttribute.Offset, 4, GL_FLOAT, false, 0, 0);
        game.GL.vertexAttribDivisor(InstancedAttribute.Offset, 1);

        game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, game.GL.createBuffer());
        game.GL.bufferData(GL_ELEMENT_ARRAY_BUFFER, Cube.Indices, GL_STATIC_DRAW);

        game.GL.bindVertexArray(null);
        game.World[entity] |= Has.Render;
        game[Get.Render][entity] = <RenderInstanced>{
            Kind: RenderKind.Instanced,
            Material: game.Materials[Mat.Instanced],
            VAO,
            IndexCount: Cube.Indices.length,
            InstanceCount: model.length / 4,
            Palette,
        };
    };
}

export const enum InstancedAttribute {
    Position = 1,
    Normal = 2,
    Offset = 3,
}

export const enum InstancedUniform {
    PV,
    World,
    Self,
    Palette,
    LightCount,
    LightPositions,
    LightDetails,
}
