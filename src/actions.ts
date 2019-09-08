import {destroy} from "./components/com_destroy.js";
import {draw} from "./components/com_draw.js";
import {Health} from "./components/com_health.js";
import {Get} from "./components/com_index.js";
import {Entity, Game} from "./game.js";
import {rand} from "./math/random.js";
import {widget_damage} from "./widgets/wid_damage.js";
import {world_desert} from "./worlds/wor_desert.js";
import {world_intro} from "./worlds/wor_intro.js";
import {world_map} from "./worlds/wor_map.js";
import {world_mine} from "./worlds/wor_mine.js";
import {world_wanted} from "./worlds/wor_wanted.js";

export interface GameState {
    WorldFunc: (game: Game) => void;
    SeedPlayer: number;
    SeedBounty: number;
    Trophies: Array<number>;
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
    ChangePlayer,
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
            let trophies = localStorage.getItem("piesku:back");
            if (trophies) {
                game.Trophies = trophies.split(",").map(Number);
            }
            // Today's timestamp. Changes every midnight, 00:00 UTC.
            save_trophy(game, ~~(Date.now() / (24 * 60 * 60 * 1000)));
            game.SeedPlayer = game.Trophies[game.Trophies.length - 1];
            break;
        }
        case Action.ChangePlayer: {
            let camera_anchor = game[Get.Transform][game.Camera!.Entity].Parent;
            game[Get.Mimic][camera_anchor!.Entity].Target = args[0] as Entity;
            game.SeedPlayer = (game[Get.Named][args[0] as Entity].Name as unknown) as number;
            break;
        }
        case Action.GoToIntro: {
            game.PlayerState = PlayerState.Playing;
            game.SeedBounty = 0;
            game.WorldFunc = world_intro;
            setTimeout(world_intro, 0, game);
            break;
        }
        case Action.GoToTown: {
            game.WorldFunc = world_map;
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
            let world_position = game[Get.Transform][entity].Translation;
            game.Add({
                Translation: [world_position[0], world_position[1] + 12, world_position[2]],
                Using: [draw(widget_damage, [damage]), destroy(1)],
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
                    save_trophy(game, game.SeedBounty);
                    game.PlayerState = PlayerState.Victory;
                    game.SeedPlayer = game.SeedBounty;

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

function save_trophy(state: GameState, seed: number) {
    if (!state.Trophies.includes(seed)) {
        state.Trophies.push(seed);
        localStorage.setItem("piesku:back", (state.Trophies as unknown) as string);
    }
}
