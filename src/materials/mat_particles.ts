import {GL_POINTS} from "../webgl.js";
import {link, Material} from "./mat_common.js";

export const enum ParticleAttribute {
    origin = 1,
}

let vertex = `#version 300 es\n
    // Projection * View matrix
    uniform mat4 uP;
    // [red, green, blue, size]
    uniform vec4 ud;

    // [x, y, z, age]
    layout(location=${ParticleAttribute.origin}) in vec4 vo;

    // Vertex color
    out vec4 vc;

    void main() {
        vec4 w = vec4(vo.xyz, 1.0);
        if (ud.a < 10.0) {
            // It's a projectile.
            w.y += vo.a * 2.0;
            gl_PointSize = mix(ud.a, 1.0, vo.a);
        } else {
            // It's a campfire.
            w.y += vo.a * 10.0;
            gl_PointSize = mix(ud.a, 1.0, vo.a);
        }
        gl_Position = uP * w;
        vc = mix(vec4(ud.rgb, 1.0), vec4(1.0, 1.0, 0.0, 1.0), vo.a);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    // Vertex color
    in vec4 vc;
    // Fragment color
    out vec4 fc;

    void main() {
        fc = vc;
    }
`;

export function mat_particles(gl: WebGL2RenderingContext) {
    let material: Material = {
        gl,
        mode: GL_POINTS,
        program: link(gl, vertex, fragment),
        uniforms: {},
    };

    for (let name of ["uP", "ud"]) {
        material.uniforms[name] = gl.getUniformLocation(material.program, name)!;
    }

    return material;
}
