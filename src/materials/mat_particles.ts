import {GL_POINTS} from "../webgl.js";
import {mat_create} from "./mat_common.js";

export const enum ParticleAttribute {
    origin = 1,
}

let vertex = `#version 300 es\n
    uniform mat4 pv;
    // [red, green, blue, size]
    uniform vec4 detail;

    // [x, y, z, age]
    layout(location=${ParticleAttribute.origin}) in vec4 origin;

    out vec4 vert_color;

    void main() {
        vec4 world_pos = vec4(origin.xyz, 1.0);
        if (detail.a < 10.0) {
            // It's a projectile.
            world_pos.y += origin.a * 2.0;
            gl_PointSize = mix(9.0, 1.0, origin.a);
        } else {
            // It's a campfire.
            world_pos.y += origin.a * 10.0;
            gl_PointSize = mix(15.0, 1.0, origin.a);
        }
        gl_Position = pv * world_pos;
        vert_color = mix(vec4(detail.rgb, 1.0), vec4(1.0, 1.0, 0.0, 1.0), origin.a);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    in vec4 vert_color;
    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`;

export function mat_particles(gl: WebGL2RenderingContext) {
    return mat_create(gl, GL_POINTS, vertex, fragment);
}
