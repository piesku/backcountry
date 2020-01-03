import {Get, Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];

    game.Camera = camera;
    camera.View = transform.World.inverse();
    camera.ViewArray = camera.View.toFloat32Array();
    camera.PV = camera.Projection.multiply(camera.View);
    camera.PVArray = camera.PV.toFloat32Array();
}
