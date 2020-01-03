import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Projectile {
    Damage: number;
}

export function projectile(Damage: number) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Projectile;
        game[Get.Projectile][entity] = <Projectile>{
            Damage,
        };
    };
}
