import {Get} from "./components/com_index.js";
import {ui} from "./components/com_ui.js";
import {Entity, Game} from "./game.js";
import {set_seed} from "./math/random.js";
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
    SeedTown: number;
    SeedBounty: number;
    SeedHouse: number;
}

export const enum Action {
    ChangeWorld = 1,
    HitEnemy,
}

export function effect(game: Game, action: Action, args: Array<unknown>) {
    switch (action) {
        case Action.ChangeWorld: {
            let [world, seed] = args as [string, number];
            game.WorldName = world;
            set_seed(seed);
            switch (world) {
                case "intro":
                    return setTimeout(world_intro, 0, game);
                case "map":
                    return setTimeout(world_map, 0, game);
                case "house":
                    game.SeedHouse = seed;
                    return setTimeout(world_house, 0, game);
                case "wanted":
                    game.SeedBounty = seed;
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
            let info = ui(text)(game)(game.CreateEntity()).Element;

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
    }
}
