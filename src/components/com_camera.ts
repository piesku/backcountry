import {Entity, Game} from "../game.js";
import {Mat4} from "../math/index.js";
import {create, invert, ortho_symmetric} from "../math/mat4.js";
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
        let Projection = ortho_symmetric(
            create(),
            Radius,
            Radius * (game.Canvas3.width / game.Canvas3.height),
            1,
            500
        );
        game.World[EntityId] |= Has.Camera;
        game[Get.Camera][EntityId] = <Camera>{
            EntityId,
            Radius,
            Projection,
            Unproject: invert([], Projection),
            View: create(),
            PV: create(),
        };
    };
}
