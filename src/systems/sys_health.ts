import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = 1 << Get.Health;

export function sys_health(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let health = game[Get.Health][entity];
    for (let i = 0; i < health.damages.length; i++) {
        health.current -= health.damages[i];
        if (health.current <= 0) {
            console.log(`Entity #${entity} has died.`);
            game.destroy(entity);
        }
    }
    health.damages = [];
}
