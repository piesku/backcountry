import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface PlayerControl {
    x: number;
    y: number;
}

export function player_control(x: number = 0, y: number = 0) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.PlayerControl;
        game[Get.PlayerControl][entity] = <PlayerControl>{x, y};
    };
}
