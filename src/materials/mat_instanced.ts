import {InstancedAttribute} from "../components/com_render_vox.js";
import {mat_create} from "./mat_common.js";

let vertex = `#version 300 es\n
    uniform mat4 pv;
    uniform mat4 world;
    uniform mat4 self;
    uniform vec4 color;
    uniform vec3 palette[16];
    uniform vec3 camera_pos;

    uniform int light_count;
    uniform vec3 light_positions[20];
    uniform vec4 light_details[20];

    layout(location=${InstancedAttribute.position}) in vec3 position;
    layout(location=${InstancedAttribute.normal}) in vec3 normal;
    layout(location=${InstancedAttribute.offset}) in vec4 offset;

    out vec4 vert_color;

    const float fog_dist = 50.0;

    void main() {
        vec4 world_pos = world * vec4(position + offset.xyz, 1.0);
        vec3 world_normal = normalize((vec4(normal, 0.0) * self).xyz);
        gl_Position = pv * world_pos;

        vec3 rgb = palette[int(offset[3])].rgb * 0.1;
        for (int i = 0; i < light_count; i++) {
            if (light_details[i].a == 0.0) {
                // A directional light.
                vec3 light_normal = normalize(light_positions[i]);
                float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
                rgb += palette[int(offset[3])].rgb * light_details[i].rgb * diffuse_factor;
            } else {
                // A point light.
                vec3 light_dir = light_positions[i] - world_pos.xyz ;
                vec3 light_normal = normalize(light_dir);
                float light_dist = length(light_dir);

                float diffuse_factor = max(dot(world_normal, light_normal), 0.0);
                float distance_factor = light_dist * light_dist;
                float intensity_factor = light_details[i].a;

                rgb += palette[int(offset[3])].rgb * light_details[i].rgb * diffuse_factor
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
