import {BasicAttribute} from "../components/com_render_basic.js";
import {mat_create} from "./mat_common.js";

let vertex = `#version 300 es\n
    uniform mat4 Upv;
    uniform mat4 Uworld;

    layout(location=${BasicAttribute.position}) in vec3 position;

    void main() {
        gl_Position = Upv * Uworld * vec4(position, 1.0);
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
    return mat_create(gl, gl.LINE_LOOP, vertex, fragment);
}