import {Entity, Game} from "../game.js";
import {Mat4, Vec3} from "../math/index.js";
import {create, ortho, perspective} from "../math/mat4.js";
import {Get} from "./com_index.js";

export interface Camera {
    position: Vec3;
    projection: Mat4;
    view: Mat4;
    pv: Mat4;
}

export function camera_perspective(fovy: number, near: number, far: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Camera;
        game[Get.Camera][entity] = <Camera>{
            position: [],
            projection: perspective(
                create(),
                fovy,
                game.canvas.width / game.canvas.height,
                near,
                far
            ),
            view: create(),
            pv: create(),
        };
    };
}

export function camera_ortho(radius: number, near: number, far: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Camera;
        game[Get.Camera][entity] = <Camera>{
            position: [],
            projection: ortho(
                create(),
                radius,
                radius * (game.canvas.width / game.canvas.height),
                -radius,
                -radius * (game.canvas.width / game.canvas.height),
                near,
                far
            ),
            view: create(),
            pv: create(),
        };
    };
}
