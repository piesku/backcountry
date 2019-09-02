import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Projectile {
    Lifespan: number;
    Age: number;
}

export function projectile(Lifespan: number) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.Projectile;
        game[Get.Projectile][entity] = <Projectile>{
            Lifespan,
            Age: 0,
        };
    };
}
