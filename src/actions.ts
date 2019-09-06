import {Health} from "./components/com_health.js";
import {Get} from "./components/com_index.js";
import {ui} from "./components/com_ui.js";
import {Entity, Game} from "./game.js";
import {rand} from "./math/random.js";
import {transform_point} from "./math/vec3.js";
import {world_desert} from "./worlds/wor_desert.js";
import {world_house} from "./worlds/wor_house.js";
import {world_intro} from "./worlds/wor_intro.js";
import {world_map} from "./worlds/wor_map.js";
import {world_mine} from "./worlds/wor_mine.js";
import {world_wanted} from "./worlds/wor_wanted.js";

export interface GameState {
    WorldName: string;
    SeedPlayer: number;
    SeedBounty: number;
    SeedHouse: number;
    Trophies: Array<number>;
    PlayerState: PlayerState;
    PlayerHealth?: Health;
}

export const enum PlayerState {
    None,
    Victory,
    Defeat,
}

export const enum Action {
    InitGame = 1,
    ChangePlayer,
    ChangeWorld,
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
            save_trophy(game, Math.floor(Date.now() / (24 * 60 * 60 * 1000)));
            game.SeedPlayer = game.Trophies[game.Trophies.length - 1];
            break;
        }
        case Action.ChangePlayer: {
            let camera_anchor = game[Get.Transform][game.Cameras[0].Entity].Parent;
            game[Get.Mimic][camera_anchor!.Entity].Target = args[0] as Entity;
            game.SeedPlayer = (game[Get.Named][args[0] as Entity].Name as unknown) as number;
            break;
        }
        case Action.ChangeWorld: {
            game.WorldName = args[0] as string;
            switch (game.WorldName) {
                case "intro":
                    game.PlayerState = PlayerState.None;
                    game.SeedBounty = 0;
                    return setTimeout(world_intro, 0, game);
                case "map":
                    return setTimeout(world_map, 0, game);
                case "house":
                    game.SeedHouse = args[1] as number;
                    return setTimeout(world_house, 0, game);
                case "wanted":
                    game.SeedBounty = rand();
                    return setTimeout(world_wanted, 0, game);
                case "mine":
                    return setTimeout(world_mine, 0, game);
                case "desert":
                    return setTimeout(world_desert, 0, game);
            }
        }
        case Action.Hit: {
            let entity = args[0] as Entity;

            let damage = (Math.random() * 1000).toFixed(0);
            let text = `<div style="animation: up 1s ease-out">${damage}</div>`;
            let info = ui(text)(game, game.CreateEntity()).Element;

            let world_position = game[Get.Transform][entity].Translation;
            let ndc_position = transform_point(
                [],
                [world_position[0], world_position[1] + 12, world_position[2]],
                game.Cameras[0].PV
            );
            info.style.left = `${0.5 * (ndc_position[0] + 1) * game.Canvas.width}px`;
            info.style.top = `${0.5 * (-ndc_position[1] + 1) * game.Canvas.height}px`;
            break;
        }
        case Action.Die: {
            let entity = args[0] as Entity;

            // If the player is killed.
            if (game.World[entity] & (1 << Get.PlayerControl)) {
                game.World[entity] &= ~(
                    (1 << Get.PlayerControl) |
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
                game.World[entity] &= ~((1 << Get.NPC) | (1 << Get.Move) | (1 << Get.Collide));
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
