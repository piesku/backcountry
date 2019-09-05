import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface PathFind {
    Destination: Vec3 | null;
    Route: Array<[number, number]>;
    DestinationX: number;
    DestinationY: number;
}

export function path_find() {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.PathFind;
        game[Get.PathFind][entity] = <PathFind>{
            Destination: null,
            Route: [],
            DestinationX: 0,
            DestinationY: 0,
        };
    };
}
