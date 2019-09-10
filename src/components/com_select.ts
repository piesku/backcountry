import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Collide} from "./com_collide.js";
import {Get} from "./com_index.js";

export interface Select {
    Hit?: Collide;
    Position: Vec3;
}

export function select() {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Select;
        game[Get.Select][entity] = <Select>{
            Position: [] as Vec3,
        };
    };
}
