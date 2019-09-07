import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Trigger {
    WorldName: string;
}

export function trigger_world(WorldName: string) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Trigger;
        game[Get.Trigger][entity] = <Trigger>{
            WorldName,
        };
    };
}
