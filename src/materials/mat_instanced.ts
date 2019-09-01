import {InstancedAttribute} from "../components/com_render_vox.js";
import {mat_create} from "./mat_common.js";

let vertex = `#version 300 es\n
    uniform mat4 Upv;
    uniform mat4 Uworld;
    uniform mat4 Uself;
    uniform vec4 Ucolor;
    uniform vec3 Upalette[16];
    uniform vec3 Ucamera_pos;

    uniform int Ulight_count;
    uniform vec3 Ulight_positions[20];
    uniform vec4 Ulight_details[20];

    layout(location=${InstancedAttribute.position}) in vec3 position;
    layout(location=${InstancedAttribute.normal}) in vec3 normal;
    layout(location=${InstancedAttribute.offset}) in vec4 offset;

    out vec4 vert_color;

    const float fog_dist = 50.0;

    void main() {
        vec4 world_pos = Uworld * vec4(position + offset.xyz, 1.0);
        vec3 world_normal = normalize((vec4(normal, 0.0) * Uself).xyz);
        gl_Position = Upv * world_pos;

        vec3 rgb = Upalette[int(offset[3])].rgb * 0.1;
        for (int i = 0; i < Ulight_count; i++) {
            if (Ulight_details[i].a == 0.0) {
                // A directional light.
                vec3 light_normal = normalize(Ulight_positions[i]);
                float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
                rgb += Upalette[int(offset[3])].rgb * Ulight_details[i].rgb * diffuse_factor;
            } else {
                // A point light.
                vec3 light_dir = Ulight_positions[i] - world_pos.xyz ;
                vec3 light_normal = normalize(light_dir);
                float light_dist = length(light_dir);

                float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
                float distance_factor = light_dist * light_dist;
                float intensity_factor = Ulight_details[i].a;

                rgb += Upalette[int(offset[3])].rgb * Ulight_details[i].rgb * diffuse_factor
                        * intensity_factor / distance_factor;
            }
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

export function mat_instanced(gl: WebGL2RenderingContext) {
    return mat_create(gl, gl.TRIANGLES, vertex, fragment);
}
