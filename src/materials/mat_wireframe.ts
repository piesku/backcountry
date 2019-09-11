import {BasicAttribute} from "../components/com_render_basic.js";
import {GL_LINE_LOOP} from "../webgl.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es\n
    // Matrices: PV, world
    uniform mat4 uP,uW;

    layout(location=${BasicAttribute.Position}) in vec3 vp;

    void main(){
        gl_Position=uP*uW*vec4(vp,1.);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    // Line color
    uniform vec4 uc;

    // Fragment color
    out vec4 fc;

    void main() {
        fc=uc;
    }
`;

export function mat_wireframe(GL: WebGL2RenderingContext) {
    let material: Material = {
        GL,
        Mode: GL_LINE_LOOP,
        Program: link(GL, vertex, fragment),
        Uniforms: [],
    };

    for (let name of ["uP", "uW", "uC"]) {
        material.Uniforms.push(GL.getUniformLocation(material.Program, name)!);
    }

    return material;
}
