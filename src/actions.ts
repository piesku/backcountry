import {Entity, Game} from "./game.js";
import {set_seed} from "./math/random.js";
import {world_desert} from "./worlds/wor_desert.js";
import {world_house} from "./worlds/wor_house.js";
import {world_intro} from "./worlds/wor_intro.js";
import {world_map} from "./worlds/wor_map.js";
import {world_mine} from "./worlds/wor_mine.js";
import {world_wanted} from "./worlds/wor_wanted.js";

export interface GameState {
    world_name: string;
    seed_player: number;
    seed_town: number;
    seed_bounty: number;
    seed_house: number;
}

export const enum Action {
    ChangeWorld = 1,
    HitEnemy,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.ChangeWorld: {
            let [world, seed] = args as [string, number];
            game.world_name = world;
            set_seed(seed);
            switch (world) {
                case "intro":
                    return setTimeout(world_intro, 0, game);
                case "map":
                    return setTimeout(world_map, 0, game);
                case "house":
                    game.seed_house = seed;
                    return setTimeout(world_house, 0, game);
                case "wanted":
                    game.seed_bounty = seed;
                    return setTimeout(world_wanted, 0, game);
                case "mine":
                    return setTimeout(world_mine, 0, game);
                case "desert":
                    return setTimeout(world_desert, 0, game);
            }
        }
        case Action.HitEnemy: {
            let entity = args[0] as Entity;
            console.log(`Hit entity #${entity}`);
            return;
        }
    }
}
