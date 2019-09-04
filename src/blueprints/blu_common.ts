import {Entity, Game} from "../game";
import {Quat, Vec3} from "../math";
import {rand} from "../math/random.js";
import {distance, lerp} from "../math/vec3.js";
import {Model} from "../model";

export type Color = [number, number, number];
export type Mixin = (game: Game) => (entity: Entity) => void;

export interface Blueprint {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Using?: Array<Mixin>;
    Children?: Array<Blueprint>;
}

export function create_tile(size: number, size_y = size, probability: number = 0.01) {
    let offsets = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size_y; y++) {
            offsets.push(
                x - size / 2 + 0.5,
                0.5,
                y - size_y / 2 + 0.5,
                rand() > probability ? 0 : 1
            );
        }
    }

    return {
        Offsets: Float32Array.from(offsets),
        Size: [size, 1, size_y],
    } as Model;
}

export function create_block(size: number, height: number) {
    let offsets = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < height; z++) {
                offsets.push(
                    x - size / 2 + 0.5,
                    z - size / 2 + 0.5,
                    y - size / 2 + 0.5,
                    rand() > 0.4 ? 0 : 1
                );
            }
        }
    }

    return {
        Offsets: Float32Array.from(offsets),
        Size: [size, height, size],
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
