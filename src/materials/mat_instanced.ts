import {InstancedAttribute} from "../components/com_render_vox.js";
import {GL_TRIANGLES} from "../webgl.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es\n
    // Projection * View matrix
    uniform mat4 uP;
    // World (model) matrix
    uniform mat4 uW;
    // Self (inverted world) matrix
    uniform mat4 uS;
    // Color palette
    uniform vec3 up[16];

    // Light count
    uniform int ulc;
    // Light positions
    uniform vec3 ulp[100];
    // Light details
    uniform vec4 uld[100];

    layout(location=${InstancedAttribute.Position}) in vec3 vp;
    layout(location=${InstancedAttribute.Normal}) in vec3 vn;
    layout(location=${InstancedAttribute.Offset}) in vec4 vo;

    // Vertex color
    out vec4 vc;

    void main() {
        // World position
        vec4 w = uW * vec4(vp + vo.xyz, 1.0);
        // World normal
        vec3 n = normalize((vec4(vn, 0.0) * uS).xyz);
        gl_Position = uP * w;

        // Color
        vec3 c = up[int(vo[3])].rgb * 0.1;
        for (int i = 0; i < ulc; i++) {
            if (uld[i].a == 0.0) {
                // A directional light.
                // Diffuse factor
                float df = max(dot(n, normalize(ulp[i])), 0.0);
                c += up[int(vo[3])].rgb * uld[i].rgb * df;
            } else {
                // A point light.
                // Light direction
                vec3 ld = ulp[i] - w.xyz;
                // Distance
                float d = length(ld);

                // Diffuse factor
                float df = max(dot(n, normalize(ld)), 0.0);
                c += up[int(vo[3])].rgb * uld[i].rgb * df * uld[i].a / (d * d);
            }
        }

        vc = vec4(c, 1.0);
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

export function mat_instanced(GL: WebGL2RenderingContext) {
    let material: Material = {
        GL,
        Mode: GL_TRIANGLES,
        Program: link(GL, vertex, fragment),
        Uniforms: [],
    };

    for (let name of ["uP", "uW", "uS", "up", "ulc", "ulp", "uld"]) {
        material.Uniforms.push(GL.getUniformLocation(material.Program, name)!);
    }

    return material;
}
