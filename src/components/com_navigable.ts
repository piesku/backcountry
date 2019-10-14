import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Navigable {
    X: number;
    Y: number;
}

export function navigable(X: number, Y: number) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Navigable;
        game[Get.Navigable][entity] = <Navigable>{X, Y};
    };
}

export function find_navigable(game: Game, {X, Y}: {X: number; Y: number}) {
    for (let i = 0; i < game.World.length; i++) {
        if (game.World[i] & Has.Navigable) {
            if (game[Get.Navigable][i].X == X && game[Get.Navigable][i].Y == Y) {
                return i;
            }
        }
    }
    throw `No entity with coords ${X}, ${Y}.`;
}
