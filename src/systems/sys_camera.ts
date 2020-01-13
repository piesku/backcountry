import {Get, Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {invert, multiply, ortho_symmetric} from "../math/mat4.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (
        game.Canvas3.width != game.Canvas3.clientWidth ||
        game.Canvas3.height != game.Canvas3.clientHeight
    ) {
        game.Canvas3.width = game.Canvas2.width = game.Canvas3.clientWidth;
        game.Canvas3.height = game.Canvas2.height = game.Canvas3.clientHeight;
        game.Resized = true;
    }

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

    if (game.Resized) {
        let aspect = game.Canvas3.width / game.Canvas3.height;
        if (aspect > 1) {
            // Landscape orientation: radius = top.
            ortho_symmetric(camera.Projection, camera.Radius, camera.Radius * aspect, 1, 500);
        } else {
            // Portrait orientation: radius = right.
            ortho_symmetric(camera.Projection, camera.Radius / aspect, camera.Radius, 1, 500);
        }
        invert(camera.Unproject, camera.Projection);
    }

    invert(camera.View, transform.World);
    multiply(camera.PV, camera.Projection, camera.View);
}
