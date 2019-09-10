import {draw} from "./components/com_draw.js";
import {Health} from "./components/com_health.js";
import {Get} from "./components/com_index.js";
import {lifespan} from "./components/com_lifespan.js";
import {Entity, Game} from "./game.js";
import {integer} from "./math/random.js";
import {widget_damage} from "./widgets/wid_damage.js";
import {world_desert} from "./worlds/wor_desert.js";
import {world_map} from "./worlds/wor_map.js";
import {world_mine} from "./worlds/wor_mine.js";
import {world_shop} from "./worlds/wor_shop.js";
import {world_town} from "./worlds/wor_town.js";
import {world_wanted} from "./worlds/wor_wanted.js";

export interface GameState {
    WorldFunc: (game: Game) => void;
    PlayerSeed: number;
    ChallengeSeed: number;
    ChallengeLevel: number;
    BountySeed: number;
    PlayerState: PlayerState;
    PlayerHealth?: Health;
    Gold: number;
}

export const enum PlayerState {
    Playing,
    Victory,
    Defeat,
}

export const enum Action {
    CompleteBounty = 1,
    EndChallenge,
    GoToTown,
    GoToShop,
    GoToWanted,
    GoToDesert,
    GoToMine,
    Hit,
    Die,
    CollectGold,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.CompleteBounty: {
            game.Gold += game.ChallengeLevel * 1000;
            game.ChallengeLevel += 1;
            game.PlayerState = PlayerState.Playing;
            game.BountySeed = 0;
            game.WorldFunc = world_town;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.EndChallenge: {
            game.Gold = 0;
            game.ChallengeLevel = 1;
            game.PlayerState = PlayerState.Playing;
            game.BountySeed = 0;
            game.WorldFunc = world_map;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToTown: {
            game.WorldFunc = world_town;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToWanted: {
            game.BountySeed = game.ChallengeSeed * game.ChallengeLevel - 1;
            game.WorldFunc = world_wanted;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToShop: {
            game.WorldFunc = world_shop;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToDesert: {
            game.WorldFunc = world_desert;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToMine: {
            game.WorldFunc = world_mine;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.Hit: {
            let [entity, damage] = args as [Entity, number];
            game.Add({
                Translation: game[Get.Transform][entity].Translation.slice(),
                Using: [draw(widget_damage, [damage]), lifespan(1)],
            });

            break;
        }
        case Action.CollectGold: {
            let [entity] = args as [Entity, number];
            let value = integer(100, 1000);

            game.Gold += value;

            game.Add({
                Translation: game[Get.Transform][game.Player!].Translation.slice(),
                Using: [draw(widget_damage, [value, "$"]), lifespan(1)],
            });
            game.Destroy(entity);
            break;
        }
        case Action.Die: {
            let entity = args[0] as Entity;

            // If the player is killed.
            if (game.World[entity] & (1 << Get.PlayerControl)) {
                game.World[entity] &= ~(
                    (1 << Get.PlayerControl) |
                    (1 << Get.Health) |
                    (1 << Get.Move) |
                    (1 << Get.Collide)
                );
                game.PlayerState = PlayerState.Defeat;
            } else if (game.World[entity] & (1 << Get.NPC)) {
                // If the boss is killed.
                if (game[Get.NPC][entity].Bounty) {
                    game.PlayerState = PlayerState.Victory;

                    // Make all bandits friendly.
                    for (let i = 0; i < game.World.length; i++) {
                        if (game.World[i] & (1 << Get.NPC)) {
                            game.World[i] &= ~(1 << Get.Walking);
                        }
                    }
                }
                game.World[entity] &= ~(
                    (1 << Get.NPC) |
                    (1 << Get.Health) |
                    (1 << Get.Move) |
                    (1 << Get.Collide)
                );
                // This must be the same as character's blueprint's Anim.Die duration.
                setTimeout(() => game.Destroy(entity), 5000);
            }
            break;
        }
    }
}
