import {Action} from "../actions.js";
import {Anim, Animate} from "../components/com_animate.js";
import {Get} from "../components/com_index.js";
import {components_of_type} from "../components/com_transform.js";
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
        let damage = health.Damages[i];
        game.Dispatch(Action.Hit, entity, damage);
        health.Current -= damage;

        for (let animate of components_of_type<Animate>(
            game,
            game[Get.Transform][entity],
            Get.Animate
        )) {
            animate.Trigger = Anim.Hit;
        }
    }
    health.Damages = [];

    if (health.Current <= 0) {
        health.Current = 0;
        game.Dispatch(Action.Die, entity);

        for (let animate of components_of_type<Animate>(
            game,
            game[Get.Transform][entity],
            Get.Animate
        )) {
            animate.Trigger = Anim.Die;
        }
    }
}
