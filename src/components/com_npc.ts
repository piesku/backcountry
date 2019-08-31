import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface NPC {}

export function npc() {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.NPC;
        game[Get.NPC][entity] = <NPC>{};
    };
}
