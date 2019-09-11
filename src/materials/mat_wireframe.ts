import {BasicAttribute} from "../components/com_render_basic.js";
import {GL_LINE_LOOP} from "../webgl.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es\n
    // Matrices: PV, world
    uniform mat4 p,q;

    layout(location=${BasicAttribute.Position}) in vec3 k;

    void main(){
        gl_Position=p*q*vec4(k,1.);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    // Line color
    uniform vec4 r;

    // Fragment color
    out vec4 z;

    void main() {
        z=r;
    }
`;

export function mat_wireframe(GL: WebGL2RenderingContext) {
    let material: Material = {
        GL,
        Mode: GL_LINE_LOOP,
        Program: link(GL, vertex, fragment),
        Uniforms: [],
    };

    for (let name of ["p", "q", "r"]) {
        material.Uniforms.push(GL.getUniformLocation(material.Program, name)!);
    }

    return material;
}
