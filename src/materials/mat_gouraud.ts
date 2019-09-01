import {ShadedAttribute} from "../components/com_render_shaded.js";
import {mat_create} from "./mat_common.js";

let vertex = `#version 300 es\n
    uniform mat4 Upv;
    uniform mat4 Uworld;
    uniform mat4 Uself;
    uniform vec4 Ucolor;
    uniform int Ulight_count;
    uniform vec3 Ulight_positions[10];
    uniform vec4 Ulight_details[10];

    layout(location=${ShadedAttribute.position}) in vec3 position;
    layout(location=${ShadedAttribute.normal}) in vec3 normal;
    out vec4 vert_color;

    void main() {
        vec4 world_pos = Uworld * vec4(position, 1.0);
        vec3 world_normal = normalize((vec4(normal, 1.0) * Uself).xyz);
        gl_Position = Upv * world_pos;

        vec3 rgb = vec3(0.0, 0.0, 0.0);
        for (int i = 0; i < Ulight_count; i++) {
            vec3 light_dir = Ulight_positions[i] - world_pos.xyz ;
            vec3 light_normal = normalize(light_dir);
            float light_dist = length(light_dir);

            float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
            float distance_factor = light_dist * light_dist;
            float intensity_factor = Ulight_details[i].a;

            rgb += Ucolor.rgb * Ulight_details[i].rgb * diffuse_factor
                    * intensity_factor / distance_factor;
        }

        vert_color = vec4(rgb, 1.0);
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

export function mat_gouraud(gl: WebGL2RenderingContext) {
    return mat_create(gl, gl.TRIANGLES, vertex, fragment);
}
