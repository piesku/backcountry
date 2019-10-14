import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Shake {
    Duration: number;
}

export function shake(Duration = 0) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Shake;
        game[Get.Shake][entity] = <Shake>{
            Duration,
        };
    };
}
