import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface PlayerControl {
    destination: Vec3 | null;
}

export function player_control() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.PlayerControl;
        game[Get.PlayerControl][entity] = <PlayerControl>{
            destination: null,
        };
    };
}
