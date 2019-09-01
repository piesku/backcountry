import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = 1 << Get.Health;

export function sys_health(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let health = game[Get.Health][entity];
    for (let i = 0; i < health.Damages.length; i++) {
        health.current -= health.Damages[i];
        if (health.current <= 0) {
            console.log(`Entity #${entity} has died.`);
            game.Destroy(entity);
        }
    }
    health.Damages = [];
}
