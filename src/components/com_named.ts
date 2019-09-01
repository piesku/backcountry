import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Named {
    Name: string;
}

export function named(Name: string) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Named;
        game[Get.Named][entity] = <Named>{Name};
    };
}

export function find_first(game: Game, name: string) {
    for (let i = 0; i < game.world.length; i++) {
        if (game.world[i] & (1 << Get.Named)) {
            if (game[Get.Named][i].Name === name) {
                return i;
            }
        }
    }
    throw `No entity named ${name}.`;
}
