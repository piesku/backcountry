import {dispatch} from "../actions.js";
import {Get, Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Collide | Has.Trigger;

export function sys_trigger(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let collisions = game[Get.Collide][entity].Collisions;
    for (let collide of collisions) {
        if (game.World[collide.EntityId] & Has.PlayerControl) {
            game.World[entity] &= ~Has.Trigger;
            dispatch(game, game[Get.Trigger][entity].Action, [entity]);
        }
    }
}
