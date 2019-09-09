import {Entity, Game} from "../game.js";
import {Mat4, Vec3} from "../math/index.js";
import {create, ortho, perspective} from "../math/mat4.js";
import {Get} from "./com_index.js";

export interface Camera {
    EntityId: Entity;
    Position: Vec3;
    Projection: Mat4;
    Unproject: Mat4;
    View: Mat4;
    PV: Mat4;
    PVArray: Float32Array;
    Cull: boolean;
}

export function camera_perspective(fovy: number, near: number, far: number) {
    return (game: Game, EntityId: Entity) => {
        let Projection = perspective(fovy, game.Canvas3.width / game.Canvas3.height, near, far);
        game.World[EntityId] |= 1 << Get.Camera;
        game[Get.Camera][EntityId] = <Camera>{
            EntityId,
            Position: [],
            Projection,
            Unproject: Projection.inverse(),
            View: create(),
            PV: create(),
            PVArray: new Float32Array(),
            Cull: false,
        };
    };
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
            Position: [],
            Projection,
            Unproject: Projection.inverse(),
            View: create(),
            PV: create(),
            PVArray: new Float32Array(),
            Cull: true,
        };
    };
}
