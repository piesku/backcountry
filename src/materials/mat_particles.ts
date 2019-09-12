import {ParticleAttribute} from "../components/com_render_particles.js";
import {GL_POINTS} from "../webgl.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es\n
    // Projection * View matrix
    uniform mat4 p;
    // [red, green, blue, size]
    uniform vec4 q;

    // [x, y, z, age]
    layout(location=${ParticleAttribute.Origin}) in vec4 k;

    // Vertex color
    out vec4 o;

    void main(){
        vec4 a=vec4(k.rgb,1.);
        if(q.a<10.) {
            // It's a projectile.
            a.y+=k.a*2.;
            gl_PointSize=mix(q.a,1.,k.a);
        }else{
            // It's a campfire.
            a.y+=k.a*10.;
            gl_PointSize=mix(q.a,1.,k.a);
        }
        gl_Position=p*a;
        o=mix(vec4(q.rgb,1.),vec4(1.,1.,0.,1.),k.a);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    // Vertex color
    in vec4 o;
    // Fragment color
    out vec4 z;

    void main(){
        z=o;
    }
`;

export function mat_particles(GL: WebGL2RenderingContext) {
    let material: Material = {
        GL,
        Mode: GL_POINTS,
        Program: link(GL, vertex, fragment),
        Uniforms: [],
    };

    for (let name of ["p", "q"]) {
        material.Uniforms.push(GL.getUniformLocation(material.Program, name)!);
    }

    return material;
}
