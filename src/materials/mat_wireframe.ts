import {BasicAttribute} from "../components/com_render_basic.js";
import {GL_ACTIVE_UNIFORMS, GL_LINE_LOOP} from "../webgl.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;

    layout(location=${BasicAttribute.position}) in vec3 position;

    void main() {
        gl_Position = pv * world * vec4(position, 1.0);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;
    uniform vec4 color;

    out vec4 frag_color;

    void main() {
        frag_color = color;
    }
`;

export function mat_wireframe(gl: WebGL2RenderingContext) {
    let material: Material = {
        gl,
        mode: GL_LINE_LOOP,
        program: link(gl, vertex, fragment),
        uniforms: {},
    };

    // Reflect uniforms.
    let uniform_count = gl.getProgramParameter(material.program, GL_ACTIVE_UNIFORMS);
    for (let i = 0; i < uniform_count; ++i) {
        let {name} = gl.getActiveUniform(material.program, i)!;
        // Array uniforms are named foo[0]; strip the [0] part.
        material.uniforms[name.replace(/\[0\]$/, "")] = gl.getUniformLocation(
            material.program,
            name
        )!;
    }

    return material;
}
