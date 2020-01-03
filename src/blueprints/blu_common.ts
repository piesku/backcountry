import {Entity, Game} from "../game";
import {Quat, Vec3} from "../math";
import {rand} from "../math/random.js";
import {length, lerp, subtract} from "../math/vec3.js";
import {Model} from "../model";
import {PaletteColors} from "./blu_building";

export type Color = [number, number, number];
export type Mixin = (game: Game, entity: Entity) => void;

export interface Blueprint {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Using?: Array<Mixin>;
    Children?: Array<Blueprint>;
}

export function create_tile(size: number, colors: [number, number]) {
    let offsets = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            offsets.push(
                x - size / 2 + 0.5,
                0.5,
                y - size / 2 + 0.5,
                rand() > 0.01 ? colors[0] : colors[1]
            );
        }
    }

    return Float32Array.from(offsets) as Model;
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
                    rand() > 0.4 ? PaletteColors.mine_ground_1 : PaletteColors.mine_ground_2
                );
            }
        }
    }

    return Float32Array.from(offsets) as Model;
}

export function create_line(from: Vec3, to: Vec3, color: number) {
    let len = length(subtract([], from, to));
    let step = 1 / len;
    let output: number[] = [];

    for (let i = 0; i < len; i++) {
        output = output.concat([...(lerp([], from, to, step * i) as number[]), color]);
    }

    return output;
}
