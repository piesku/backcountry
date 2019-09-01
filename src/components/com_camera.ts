import {Entity, Game} from "../game.js";
import {Mat4, Vec3} from "../math/index.js";
import {create, invert, ortho, perspective} from "../math/mat4.js";
import {Get} from "./com_index.js";

export interface Camera {
    Entity: Entity;
    Position: Vec3;
    Projection: Mat4;
    Unproject: Mat4;
    View: Mat4;
    PV: Mat4;
    Cull: boolean;
}

export function camera_perspective(fovy: number, near: number, far: number) {
    return (game: Game) => (entity: Entity) => {
        let Projection = perspective(
            create(),
            fovy,
            game.canvas.width / game.canvas.height,
            near,
            far
        );
        game.world[entity] |= 1 << Get.Camera;
        game[Get.Camera][entity] = <Camera>{
            Entity: entity,
            Position: [],
            Projection,
            Unproject: invert([], Projection),
            View: create(),
            PV: create(),
            Cull: false,
        };
    };
}

export function camera_ortho(radius: number, near: number, far: number) {
    return (game: Game) => (entity: Entity) => {
        let Projection = ortho(
            create(),
            radius,
            radius * (game.canvas.width / game.canvas.height),
            -radius,
            -radius * (game.canvas.width / game.canvas.height),
            near,
            far
        );
        game.world[entity] |= 1 << Get.Camera;
        game[Get.Camera][entity] = <Camera>{
            Entity: entity,
            Position: [],
            Projection,
            Unproject: invert([], Projection),
            View: create(),
            PV: create(),
            Cull: true,
        };
    };
}
