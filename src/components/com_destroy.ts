import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Destroy {
    Lifespan: number;
}

export function destroy(Lifespan = Infinity) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Destroy;
        game[Get.Destroy][entity] = <Destroy>{
            Lifespan,
        };
    };
}
