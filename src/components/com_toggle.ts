import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Toggle {
    /** The compoment to turn on when duration is greater than zero. */
    Component: Get;
    /** How long (in seconds) to keep the component enabled. */
    Duration: number;
}

export function toggle(Component: Get, Duration = 0) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.Toggle;
        game[Get.Toggle][entity] = <Toggle>{
            Component,
            Duration,
        };
    };
}
