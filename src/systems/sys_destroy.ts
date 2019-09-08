import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Destroy);

export function sys_toggle(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let toggle = game[Get.Destroy][entity];
    if (toggle.Lifespan > 0) {
        toggle.Lifespan -= delta;
    } else {
        game.Destroy(entity);
    }
}
