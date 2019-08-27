import {Mat4, Quat, Vec3} from "./index.js";
import {normalize} from "./vec3.js";

type Mat4Array = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];

export function create(values?: Mat4Array): Mat4 {
    return values ? new DOMMatrix(values) : new DOMMatrix();
}

export function from_rotation_translation_scale(mat: Mat4, q: Quat, v: Vec3, s: Vec3) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    mat.m11 = (1 - (yy + zz)) * sx;
    mat.m12 = (xy + wz) * sx;
    mat.m13 = (xz - wy) * sx;
    mat.m14 = 0;
    mat.m21 = (xy - wz) * sy;
    mat.m22 = (1 - (xx + zz)) * sy;
    mat.m23 = (yz + wx) * sy;
    mat.m24 = 0;
    mat.m31 = (xz + wy) * sz;
    mat.m32 = (yz - wx) * sz;
    mat.m33 = (1 - (xx + yy)) * sz;
    mat.m34 = 0;
    mat.m41 = v[0];
    mat.m42 = v[1];
    mat.m43 = v[2];
    mat.m44 = 1;
}

export function perspective(fovy: number, aspect: number, near: number, far: number) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    let out = create([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0]);

    if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        out.m33 = (far + near) * nf;
        out.m43 = 2 * far * near * nf;
    } else {
        out.m33 = -1;
        out.m43 = -2 * near;
    }

    return out;
}

export function ortho(
    top: number,
    right: number,
    bottom: number,
    left: number,
    near: number,
    far: number
) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    return create([
        -2 * lr,
        0,
        0,
        0,
        0,
        -2 * bt,
        0,
        0,
        0,
        0,
        2 * nf,
        0,
        (left + right) * lr,
        (top + bottom) * bt,
        (far + near) * nf,
        1,
    ]);
}

export function get_left(out: Vec3, mat: Mat4) {
    out[0] = mat.m11;
    out[1] = mat.m12;
    out[2] = mat.m13;
    return normalize(out, out);
}

export function get_up(out: Vec3, mat: Mat4) {
    out[0] = mat.m21;
    out[1] = mat.m22;
    out[2] = mat.m23;
    return normalize(out, out);
}

export function get_forward(out: Vec3, mat: Mat4) {
    out[0] = mat.m31;
    out[1] = mat.m32;
    out[2] = mat.m33;
    return normalize(out, out);
}

export function get_translation(out: Vec3, mat: Mat4) {
    out[0] = mat.m41;
    out[1] = mat.m42;
    out[2] = mat.m43;

    return out;
}

export function get_scaling(out: Vec3, mat: Mat4) {
    out[0] = Math.hypot(mat.m11, mat.m12, mat.m13);
    out[1] = Math.hypot(mat.m21, mat.m22, mat.m23);
    out[2] = Math.hypot(mat.m31, mat.m32, mat.m33);

    return out;
}

export function get_rotation(out: Quat, mat: Mat4) {
    let scaling = new Float32Array(3);
    get_scaling(scaling, mat);

    let is1 = 1 / scaling[0];
    let is2 = 1 / scaling[1];
    let is3 = 1 / scaling[2];

    let sm11 = mat.m11 * is1;
    let sm12 = mat.m12 * is2;
    let sm13 = mat.m13 * is3;
    let sm21 = mat.m21 * is1;
    let sm22 = mat.m22 * is2;
    let sm23 = mat.m23 * is3;
    let sm31 = mat.m31 * is1;
    let sm32 = mat.m32 * is2;
    let sm33 = mat.m33 * is3;

    let trace = sm11 + sm22 + sm33;
    let S = 0;

    if (trace > 0) {
        S = Math.sqrt(trace + 1.0) * 2;
        out[3] = 0.25 * S;
        out[0] = (sm23 - sm32) / S;
        out[1] = (sm31 - sm13) / S;
        out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
        S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
        out[3] = (sm23 - sm32) / S;
        out[0] = 0.25 * S;
        out[1] = (sm12 + sm21) / S;
        out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
        S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
        out[3] = (sm31 - sm13) / S;
        out[0] = (sm12 + sm21) / S;
        out[1] = 0.25 * S;
        out[2] = (sm23 + sm32) / S;
    } else {
        S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
        out[3] = (sm12 - sm21) / S;
        out[0] = (sm31 + sm13) / S;
        out[1] = (sm23 + sm32) / S;
        out[2] = 0.25 * S;
    }

    return out;
}

export function target_to(eye: Vec3, target: Vec3, up: Vec3) {
    let eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2];

    let z0 = eyex - target[0],
        z1 = eyey - target[1],
        z2 = eyez - target[2];

    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        z0 *= len;
        z1 *= len;
        z2 *= len;
    }

    let x0 = upy * z2 - upz * z1,
        x1 = upz * z0 - upx * z2,
        x2 = upx * z1 - upy * z0;

    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    return create([
        x0,
        x1,
        x2,
        0,
        z1 * x2 - z2 * x1,
        z2 * x0 - z0 * x2,
        z0 * x1 - z1 * x0,
        0,
        z0,
        z1,
        z2,
        0,
        eyex,
        eyey,
        eyez,
        1,
    ]);
}
