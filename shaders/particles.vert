#version 300 es

// Projection * View matrix
uniform mat4 uP;
// [red, green, blue, size]
uniform vec4 ud;
// [x, y, z, age]
layout(location=${ParticleAttribute.Origin}) in vec4 vo;
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
