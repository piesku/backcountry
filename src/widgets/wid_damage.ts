import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {ease_out_quart} from "../math/easing.js";

export function widget_damage(
    game: Game,
    entity: Entity,
    x: number,
    y: number,
    [damage]: Array<unknown>
) {
    let lifespan = game[Get.Lifespan][entity];
    let relative = lifespan.Age / lifespan.Max;
    game.Context.font = `${(damage as number) / 125 + 1}vh Impact`;
    game.Context.textAlign = "center";
    game.Context.fillStyle = `rgba(255, 232, 198, ${1 - relative})`;
    game.Context.fillText((damage as number).toFixed(0), x, y - ease_out_quart(relative) * 100);
}
