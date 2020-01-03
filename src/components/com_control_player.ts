import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface PlayerControl {}

export function player_control() {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.PlayerControl;
        game[Get.PlayerControl][entity] = <PlayerControl>{};
    };
}
