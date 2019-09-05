import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Projectile {
    Damage: number;
    Lifespan: number;
    Age: number;
}

export function projectile(Damage: number, Lifespan: number) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Projectile;
        game[Get.Projectile][entity] = <Projectile>{
            Damage,
            Lifespan,
            Age: 0,
        };
    };
}
