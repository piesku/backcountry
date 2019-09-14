import {draw} from "./components/com_draw.js";
import {Get} from "./components/com_index.js";
import {lifespan} from "./components/com_lifespan.js";
import {Entity, Game} from "./game.js";
import {integer} from "./math/random.js";
import {snd_gold} from "./sounds/snd_gold.js";
import {widget_damage} from "./widgets/wid_damage.js";
import {widget_gold} from "./widgets/wid_gold.js";
import {widget_player_hit} from "./widgets/wid_player_hit.js";
import {world_desert} from "./worlds/wor_desert.js";
import {world_mine} from "./worlds/wor_mine.js";
import {world_store} from "./worlds/wor_store.js";
import {world_intro, world_town} from "./worlds/wor_town.js";
import {world_wanted} from "./worlds/wor_wanted.js";

export interface GameState {
    WorldFunc: (game: Game) => void;
    PlayerSeed: number;
    ChallengeSeed: number;
    ChallengeLevel: number;
    BountySeed: number;
    PlayerState: PlayerState;
    PlayerXY?: {X: number; Y: number};
    Gold: number;
    MonetizationEnabled: boolean;
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
    GoToStore,
    GoToWanted,
    GoToDesert,
    GoToMine,
    Hit,
    Die,
    CollectGold,
    ChangePlayerSeed,
    HealCampfire,
}

declare global {
    interface Document {
        monetization: {state: "pending" | "started"};
    }
}

export function dispatch(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.CompleteBounty: {
            game.WorldFunc = world_town;
            setTimeout(game.WorldFunc, 0, game, false, game.ChallengeLevel * 1000);
            game.Gold += game.ChallengeLevel * 1000;
            game.ChallengeLevel += 1;
            game.PlayerState = PlayerState.Playing;
            game.PlayerXY = undefined;
            game.BountySeed = 0;
            break;
        }
        case Action.EndChallenge: {
            game.Gold = 0;
            game.ChallengeLevel = 1;
            game.PlayerState = PlayerState.Playing;
            game.PlayerXY = undefined;
            game.BountySeed = 0;
            game.WorldFunc = world_intro;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToTown: {
            game.Audio.close();
            game.Audio = new AudioContext();
            game.WorldFunc = world_town;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToWanted: {
            game.PlayerXY = game[Get.Walking][game.Player!];
            game.BountySeed = game.ChallengeSeed * game.ChallengeLevel - 1;
            game.WorldFunc = world_wanted;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToStore: {
            game.MonetizationEnabled =
                document.monetization && document.monetization.state == "started";
            game.PlayerXY = game[Get.Walking][game.Player!];
            game.WorldFunc = world_store;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.ChangePlayerSeed: {
            if (game.MonetizationEnabled) {
                game.PlayerSeed = Math.random() * 10000;
            }
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToDesert: {
            game.Audio.close();
            game.Audio = new AudioContext();
            game.WorldFunc = world_desert;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.GoToMine: {
            game.Audio.close();
            game.Audio = new AudioContext();
            game.WorldFunc = game.BountySeed ? world_mine : world_town;
            setTimeout(game.WorldFunc, 0, game);
            break;
        }
        case Action.Hit: {
            let [entity, damage] = args as [Entity, number];
            game.Add({
                Translation: game[Get.Transform][entity].Translation.slice(),
                Using: [draw(widget_damage, damage), lifespan(1)],
            });
            if (game.World[entity] & (1 << Get.PlayerControl)) {
                game.Add({
                    Using: [draw(widget_player_hit), lifespan(1)],
                });
            }

            break;
        }
        case Action.CollectGold: {
            let [entity] = args as [Entity, number];
            let value = integer(100, 1000);
            game.Gold += value;
            game[Get.AudioSource][entity].Trigger = snd_gold;
            game.Add({
                Translation: game[Get.Transform][game.Player!].Translation.slice(),
                Using: [draw(widget_gold, value), lifespan(1)],
            });
            // Schedule destruction of the gold entity at the beginning of the
            // next frame, so that sys_audio can play the pick-up sfx.
            lifespan(0)(game, entity);
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
        case Action.HealCampfire: {
            let entity = args[0] as Entity;
            game.Destroy(entity);
            let health = game[Get.Health][game.Player!];
            health.Current = health.Max;
        }
    }
}
