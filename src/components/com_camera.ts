import {Entity, Game} from "../game.js";
import {Mat4} from "../math/index.js";
import {create} from "../math/mat4.js";
import {Get, Has} from "./com_index.js";

export interface Camera {
    EntityId: Entity;
    Radius: number;
    Projection: Mat4;
    Unproject: Mat4;
    View: Mat4;
    PV: Mat4;
}

export function camera_ortho(Radius: number) {
    return (game: Game, EntityId: Entity) => {
        game.World[EntityId] |= Has.Camera;
        game[Get.Camera][EntityId] = <Camera>{
            EntityId,
            Radius,
            Projection: create(),
            Unproject: create(),
            View: create(),
            PV: create(),
        };
    };
}
