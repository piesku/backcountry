import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface Selectable {
    readonly entity: Entity;
    selected: boolean;
    hit: Vec3;
}

export function selectable() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Selectable;
        game[Get.Selectable][entity] = <Selectable>{
            entity,
            selected: false,
            hit: [0, 0, 0],
        };
    };
}
