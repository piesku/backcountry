import {BasicAttribute} from "../components/com_render_basic.js";
import {GL_LINE_LOOP} from "../webgl.js";
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
        uniforms: {
            pv: 0,
            detail: 0,
        },
    };

    for (let name in material.uniforms) {
        material.uniforms[name] = gl.getUniformLocation(material.program, name)!;
    }

    return material;
}
