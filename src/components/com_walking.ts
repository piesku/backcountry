import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface Walking {
    X: number;
    Y: number;
    Destination: Vec3 | null;
    Route: Array<{X: number; Y: number}>;
    DestinationX: number;
    DestinationY: number;
}

export function walking(X = 0, Y = 0) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Walking;
        game[Get.Walking][entity] = <Walking>{
            X,
            Y,
            Destination: null,
            Route: [],
            DestinationX: 0,
            DestinationY: 0,
        };
    };
}
