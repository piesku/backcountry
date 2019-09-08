import {GL_ACTIVE_UNIFORMS, GL_FRAGMENT_SHADER, GL_VERTEX_SHADER} from "../webgl.js";

export interface Shape {
    Vertices: Float32Array;
    Indices: Uint16Array;
    Normals: Float32Array;
}

export interface Material {
    gl: WebGL2RenderingContext;
    mode: GLint;
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation>;
}

export function mat_create(
    gl: WebGL2RenderingContext,
    mode: GLint,
    vertex: string,
    fragment: string
) {
    let material: Material = {
        gl: gl,
        mode: mode,
        program: link(gl, vertex, fragment),
        uniforms: {},
    };

    // Reflect uniforms.
    let uniform_count = gl.getProgramParameter(material.program, GL_ACTIVE_UNIFORMS);
    for (let i = 0; i < uniform_count; ++i) {
        let {name} = gl.getActiveUniform(material.program, i)!;
        // Array uniforms are named foo[0]; strip the [0] part.
        material.uniforms[name.replace(/\[0\]$/, "")] = gl.getUniformLocation(
            material.program,
            name
        )!;
    }

    return material;
}

function link(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
    let program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, GL_VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl, GL_FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    return program;
}

function compile(gl: WebGL2RenderingContext, type: GLint, source: string) {
    let shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
