import {Entity, Game} from "../game.js";
import {Mat4} from "../math/index.js";
import {create, ortho} from "../math/mat4.js";
import {Get} from "./com_index.js";

export interface Camera {
    EntityId: Entity;
    Projection: Mat4;
    Unproject: Mat4;
    View: Mat4;
    ViewArray: Float32Array;
    PV: Mat4;
    PVArray: Float32Array;
}

export function camera_ortho(radius: number, near: number, far: number) {
    return (game: Game, EntityId: Entity) => {
        let Projection = ortho(
            radius,
            radius * (game.Canvas3.width / game.Canvas3.height),
            -radius,
            -radius * (game.Canvas3.width / game.Canvas3.height),
            near,
            far
        );
        game.World[EntityId] |= 1 << Get.Camera;
        game[Get.Camera][EntityId] = <Camera>{
            EntityId,
            Projection,
            Unproject: Projection.inverse(),
            View: create(),
            ViewArray: new Float32Array(),
            PV: create(),
            PVArray: new Float32Array(),
        };
    };
}
