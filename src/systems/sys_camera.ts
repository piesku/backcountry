import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Camera);

export function sys_camera(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];

    game.Camera = camera;
    get_translation(camera.Position, transform.World);
    camera.View = transform.World.inverse();
    camera.PV = camera.Projection.multiply(camera.View);
    camera.PVArray = camera.PV.toFloat32Array();
}
