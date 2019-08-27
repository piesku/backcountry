import {Entity, Game} from "../game.js";
import {RaycastHit} from "../math/raycast.js";
import {Get} from "./com_index.js";

export interface Select {
    hit?: RaycastHit;
}

export function select() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Select;
        game[Get.Select][entity] = <Select>{};
    };
}
