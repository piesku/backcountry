import {Entity, Game} from "../game.js";
import {Quat, Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface Move {
    /** Units per second. */
    readonly move_speed: number;
    /** Radians per second. */
    readonly rotate_speed: number;
    dir?: Vec3;
    yaw?: Quat;
}

export function move(move_speed: number = 3.5, rotate_speed: number = 0.5) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Move;
        game[Get.Move][entity] = <Move>{
            move_speed,
            rotate_speed,
        };
    };
}
