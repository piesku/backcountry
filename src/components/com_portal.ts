import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

type World = (game: Game) => void;

export interface Portal {
    to: World;
}

export function portal(to: World) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Portal;
        game[Get.Portal][entity] = <Portal>{to};
    };
}
