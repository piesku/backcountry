import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";
import {components_of_type, Transform} from "./com_transform.js";

export interface Named {
    EntityId: Entity;
    Name: string;
}

export function named(Name: string) {
    return (game: Game, EntityId: Entity) => {
        game.World[EntityId] |= 1 << Get.Named;
        game[Get.Named][EntityId] = <Named>{
            EntityId,
            Name,
        };
    };
}

export function find_first(game: Game, name: string) {
    for (let i = 0; i < game.World.length; i++) {
        if (game.World[i] & (1 << Get.Named)) {
            if (game[Get.Named][i].Name == name) {
                return i;
            }
        }
    }
    throw `No entity named ${name}.`;
}

export function find_child(game: Game, transform: Transform, name: string) {
    for (let child of components_of_type<Named>(game, transform, Get.Named)) {
        if (child.Name == name) {
            return child.EntityId;
        }
    }
}
