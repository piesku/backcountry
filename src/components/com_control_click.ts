import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface ClickControl {
    destination: Vec3 | null;
    route: Array<[number, number]>;
    destination_x: number;
    destination_y: number;
}

export function click_control() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.ClickControl;
        game[Get.ClickControl][entity] = <ClickControl>{
            destination: null,
            route: [],
            destination_x: 0,
            destination_y: 0,
        };
    };
}
