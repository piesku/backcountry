import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Toggle);

export function sys_toggle(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let toggle = game[Get.Toggle][entity];

    if (toggle.Duration > 0) {
        toggle.Duration -= delta;
        game.World[entity] |= 1 << toggle.Component;
    }

    if (toggle.Duration <= 0) {
        toggle.Duration = 0;
        game.World[entity] &= ~(1 << toggle.Component);
    }
}
