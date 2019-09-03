import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Shake {
    Trigger: boolean;
    Duration: number;
    Remaining: number;
}

export function shake(Duration: number) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.Shake;
        game[Get.Shake][entity] = <Shake>{
            Trigger: false,
            Duration,
            Remaining: 0,
        };
    };
}
