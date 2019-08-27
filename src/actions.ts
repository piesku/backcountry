import {Game} from "./game.js";
import {world_characters} from "./worlds/wor_characters.js";
import {world_intro} from "./worlds/wor_intro.js";
import {world_map} from "./worlds/wor_map.js";
import {world_stage} from "./worlds/wor_stage.js";

export const enum Action {
    ChangeWorld,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.ChangeWorld: {
            switch (args[0] as string) {
                case "intro":
                    return setTimeout(world_intro, 0, game);
                case "stage":
                    return setTimeout(world_stage, 0, game);
                case "characters":
                    return setTimeout(world_characters, 0, game);
                case "map":
                    return setTimeout(world_map, 0, game);
            }
        }
    }
}
