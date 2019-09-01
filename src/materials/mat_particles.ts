import {mat_create} from "./mat_common.js";

export const enum ParticleAttribute {
    id = 1,
    origin = 2,
    age = 3,
}

let vertex = `#version 300 es\n
    uniform mat4 Upv;
    uniform vec3 Ucamera_pos;
    uniform float Usize;
    uniform float Uvertical;
    uniform vec3 Ustart_color;
    uniform vec3 Uend_color;

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
        world_pos.y += age * Uvertical;
        world_pos.z += rand_y / 3.0;
        gl_Position = Upv * world_pos;
        gl_PointSize = mix(Usize, Usize * 10.0, age);
        vert_color = mix(vec4(Ustart_color, 1.0), vec4(Uend_color, 1.0), age);
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
