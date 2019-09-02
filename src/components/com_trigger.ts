import {Action} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Trigger {
    Mask: Get;
    Action: Action;
    Args: Array<unknown>;
}

export function trigger(Mask: Get, Action: Action, ...Args: Array<unknown>) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.Trigger;
        game[Get.Trigger][entity] = <Trigger>{
            Mask,
            Action,
            Args,
        };
    };
}

export function trigger_world(name: string, seed: number) {
    return trigger(1 << Get.PlayerControl, Action.ChangeWorld, name, seed);
}
