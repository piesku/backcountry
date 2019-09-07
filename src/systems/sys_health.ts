import {Action} from "../actions.js";
import {Anim, Animate} from "../components/com_animate.js";
import {Get} from "../components/com_index.js";
import {components_of_type} from "../components/com_transform.js";
import {UI} from "../components/com_ui.js";
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
        game.Dispatch(Action.Hit, entity);

        health.Current -= health.Damages[i];
        if (health.Current > 0) {
            for (let animate of components_of_type<Animate>(
                game,
                game[Get.Transform][entity],
                Get.Animate
            )) {
                animate.Trigger = Anim.Hit;
            }
        } else {
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
    health.Damages = [];
    for (let ui of components_of_type<UI>(game, game[Get.Transform][entity], Get.UI)) {
        let width = (health.Current / health.Max) * 10;
        ui.Element.querySelector("div")!.style.width = `${width}vw`;
    }
}
