import {mat_create} from "./mat_common.js";

export const enum ParticleAttribute {
    id = 1,
    origin = 2,
    age = 3,
}

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform float size;
    uniform float vertical;
    uniform vec3 start_color;
    uniform vec3 end_color;

    layout(location=${ParticleAttribute.id}) in float id;
    layout(location=${ParticleAttribute.origin}) in vec3 origin;
    layout(location=${ParticleAttribute.age}) in float age;

    out vec4 vert_color;

    void main() {
        // Pseudo-random numbers in range of [-0.5, 0.5].
        float rand_x = id - 0.5;
        float rand_y = fract(id * 1000.0) - 0.5;

        vec4 world_pos = vec4(origin, 1.0);
        world_pos.x += rand_x / 3.0;
        world_pos.y += age * vertical;
        world_pos.z += rand_y / 3.0;
        gl_Position = pv * world_pos;
        gl_PointSize = mix(size, size * 10.0, age);
        vert_color = mix(vec4(start_color, 1.0), vec4(end_color, 1.0), age);
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
    return mat_create(gl, gl.POINTS, vertex, fragment);
}
