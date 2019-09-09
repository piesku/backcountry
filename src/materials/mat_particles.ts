import {GL_POINTS} from "../webgl.js";
import {link, Material} from "./mat_common.js";

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
            gl_PointSize = mix(detail.a, 1.0, origin.a);
        } else {
            // It's a campfire.
            world_pos.y += origin.a * 10.0;
            gl_PointSize = mix(detail.a, 1.0, origin.a);
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
    let material: Material = {
        gl,
        mode: GL_POINTS,
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
