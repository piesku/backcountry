import {Entity, Game} from "./game.js";
import {rand} from "./math/random.js";
import {world_house} from "./worlds/wor_house.js";
import {world_intro} from "./worlds/wor_intro.js";
import {world_map} from "./worlds/wor_map.js";
import {world_mine} from "./worlds/wor_mine.js";
import {world_wanted} from "./worlds/wor_wanted.js";

export const enum Action {
    ChangeWorld,
    HitEnemy,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.ChangeWorld: {
            switch (args[0] as string) {
                case "intro":
                    return setTimeout(world_intro, 0, game);
                case "map":
                    return setTimeout(world_map, 0, game);
                case "house":
                    return setTimeout(world_house, 0, game);
                case "wanted":
                    game.state.seed_bounty = rand() * 100;
                    return setTimeout(world_wanted, 0, game);
                case "mine":
                    return setTimeout(world_mine, 0, game);
            }
        }
        case Action.HitEnemy: {
            let entity = args[0] as Entity;
            console.log(`Hit entity #${entity}`);
            return;
        }
    }
}
