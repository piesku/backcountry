import {Vec3} from "../math/index.js";
import {distance, lerp} from "../math/vec3.js";
import {Model} from "../model.js";

export function create_tile(size: number, size_y = size, probability: number = 0.01) {
    let offsets = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size_y; y++) {
            offsets.push(
                x - size / 2 + 0.5,
                0.5,
                y - size_y / 2 + 0.5,
                Math.random() > probability ? 0 : 1
            );
        }
    }

    return {
        offsets: Float32Array.from(offsets),
        size: [size, 1, size_y],
    } as Model;
}

export function create_line(from: Vec3, to: Vec3, color: number) {
    let length = distance(from, to);
    let step = 1 / length;
    let output: number[] = [];

    for (let i = 0; i < length; i++) {
        output = output.concat([...(lerp([], from, to, step * i) as number[]), color]);
    }

    return output;
}
