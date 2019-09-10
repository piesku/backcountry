import {draw} from "./components/com_draw.js";
import {Health} from "./components/com_health.js";
import {Get} from "./components/com_index.js";
import {lifespan} from "./components/com_lifespan.js";
import {Entity, Game} from "./game.js";
import {rand} from "./math/random.js";
import {widget_damage} from "./widgets/wid_damage.js";
import {world_desert} from "./worlds/wor_desert.js";
import {world_mine} from "./worlds/wor_mine.js";
import {world_town} from "./worlds/wor_town.js";
import {world_wanted} from "./worlds/wor_wanted.js";

export interface GameState {
    WorldFunc: (game: Game) => void;
    ChallengeSeed: number;
    ChallengeLevel: number;
    SeedBounty: number;
    PlayerState: PlayerState;
    PlayerHealth?: Health;
}

export const enum PlayerState {
    Playing,
    Victory,
    Defeat,
}

export const enum Action {
    InitGame = 1,
    GoToIntro,
    GoToTown,
    GoToWanted,
    GoToDesert,
    GoToMine,
    Hit,
    Die,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.InitGame: {
            // Today's timestamp. Changes every midnight, 00:00 UTC.
            game.ChallengeSeed = ~~(Date.now() / (24 * 60 * 60 * 1000));
            break;
        }
        case Action.GoToIntro: {
            game.PlayerState = PlayerState.Playing;
            game.SeedBounty = 0;
            game.WorldFunc = world_town;
            setTimeout(world_town, 0, game);
            break;
        }
        case Action.GoToTown: {
            game.WorldFunc = world_town;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToWanted: {
            game.SeedBounty = rand();
            game.WorldFunc = world_wanted;
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
                    game.ChallengeSeed = game.SeedBounty;

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
