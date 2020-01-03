import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface NPC {
    Friendly: boolean;
    Bounty: boolean;
    LastShot: number;
}

export function npc(Friendly = true, Bounty = false) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.NPC;
        game[Get.NPC][entity] = <NPC>{
            Friendly,
            Bounty,
            LastShot: 0,
        };
    };
}
