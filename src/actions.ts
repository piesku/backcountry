import {create_reward} from "./blueprints/blu_reward.js";
import {Get} from "./components/com_index.js";
import {ui} from "./components/com_ui.js";
import {Entity, Game} from "./game.js";
import {rand, set_seed} from "./math/random.js";
import {transform_point} from "./math/vec3.js";
import {get_item, set_item} from "./storage.js";
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
}

export const enum Action {
    InitGame = 1,
    ChangePlayer,
    ChangeWorld,
    HitEnemy,
    KillEnemy,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.InitGame: {
            save_trophy(game.SeedPlayer);
            break;
        }
        case Action.ChangePlayer: {
            let camera_anchor = game[Get.Transform][game.Cameras[0].Entity].Parent;
            game[Get.Mimic][camera_anchor!.Entity].Target = args[0] as Entity;
            break;
        }
        case Action.ChangeWorld: {
            game.WorldName = args[0] as string;
            switch (game.WorldName) {
                case "intro":
                    save_trophy(game.SeedBounty);
                    game.SeedPlayer = game.SeedBounty;
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
        case Action.HitEnemy: {
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
        case Action.KillEnemy: {
            let entity = args[0] as Entity;
            if (game[Get.NPC][entity].Bounty) {
                set_seed(game.SeedBounty);
                let world_position = game[Get.Transform][entity].Translation;
                let anchor = game.Add({
                    Translation: world_position,
                });
                game.Add({
                    ...create_reward(game, anchor),
                    Translation: [world_position[0], world_position[1] + 100, world_position[2]],
                });
            }
        }
    }
}

function save_trophy(seed: number) {
    let trophies = get_item<Array<number>>("trophies") || [];
    if (!trophies.includes(seed)) {
        trophies.push(seed);
        set_item("trophies", trophies);
    }
}
