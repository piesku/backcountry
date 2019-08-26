import {Game} from "./game.js";
import {world_intro} from "./worlds/wor_intro.js";
import {world_map} from "./worlds/wor_map.js";
import {world_stage} from "./worlds/wor_stage.js";

export const enum Action {
    ChangeWorld,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.ChangeWorld: {
            let world = args[0] as string;
            switch (world) {
                case "intro":
                    return world_intro(game);
                case "stage":
                    return world_stage(game);
                case "map":
                    return world_map(game);
            }
        }
    }
}
