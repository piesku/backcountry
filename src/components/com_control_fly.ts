import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface FlyControl {
    readonly move: boolean;
    readonly pitch: boolean;
    readonly yaw: boolean;
}

export function fly_control(move: boolean, yaw: boolean, pitch: boolean) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.FlyControl;
        game[Get.FlyControl][entity] = <FlyControl>{
            move,
            yaw,
            pitch,
        };
    };
}
