import {BasicAttribute} from "../components/com_render_basic.js";
import {GL_LINE_LOOP} from "../webgl.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es\n
    // Projection * View matrix
    uniform mat4 uP;
    // World (model) matrix
    uniform mat4 uW;

    layout(location=${BasicAttribute.position}) in vec3 vp;

    void main() {
        gl_Position = uP * uW * vec4(vp, 1.0);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    // Line color
    uniform vec4 uc;

    // Fragment color
    out vec4 fc;

    void main() {
        fc = uc;
    }
`;

export function mat_wireframe(gl: WebGL2RenderingContext) {
    let material: Material = {
        gl,
        mode: GL_LINE_LOOP,
        program: link(gl, vertex, fragment),
        uniforms: {},
    };

    for (let name of ["uP", "uW", "uC"]) {
        material.uniforms[name] = gl.getUniformLocation(material.program, name)!;
    }

    return material;
}
