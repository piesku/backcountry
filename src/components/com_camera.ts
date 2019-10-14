import {Entity, Game} from "../game.js";
import {Mat4} from "../math/index.js";
import {create, invert, ortho} from "../math/mat4.js";
import {Get, Has} from "./com_index.js";

export interface Camera {
    EntityId: Entity;
    Projection: Mat4;
    Unproject: Mat4;
    View: Mat4;
    PV: Mat4;
}

export function camera_ortho(radius: number, near: number, far: number) {
    return (game: Game, EntityId: Entity) => {
        let Projection = ortho(
            create(),
            radius,
            radius * (game.Canvas3.width / game.Canvas3.height),
            -radius,
            -radius * (game.Canvas3.width / game.Canvas3.height),
            near,
            far
        );
        game.World[EntityId] |= Has.Camera;
        game[Get.Camera][EntityId] = <Camera>{
            EntityId,
            Projection,
            Unproject: invert([], Projection),
            View: create(),
            PV: create(),
        };
    };
}
