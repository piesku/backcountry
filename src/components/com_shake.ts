import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Shake {
    Duration: number;
}

export function shake(Duration = 0) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.Shake;
        game[Get.Shake][entity] = <Shake>{
            Duration,
        };
    };
}
