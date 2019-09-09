import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface NPC {
    Friendly: boolean;
    Bounty: boolean;
    LastShot: number;
}

export function npc(Friendly = true, Bounty = false) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.NPC;
        game[Get.NPC][entity] = <NPC>{
            Friendly,
            Bounty,
            LastShot: 0,
        };
    };
}
