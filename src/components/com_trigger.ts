import {Action} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Trigger {
    action: Action;
    args: Array<unknown>;
}

export function trigger(action: Action, ...args: Array<unknown>) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Trigger;
        game[Get.Trigger][entity] = <Trigger>{
            action,
            args,
        };
    };
}

export function trigger_world(name: string) {
    return trigger(Action.ChangeWorld, name);
}
