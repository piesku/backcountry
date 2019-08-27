import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Health {
    max: number;
    current: number;
    damages: Array<number>;
}

export function health(max: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Health;
        game[Get.Health][entity] = <Health>{
            max,
            current: max,
            damages: [],
        };
    };
}
