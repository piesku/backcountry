import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {ease_out_quart} from "../math/easing.js";

export function widget_damage(game: Game, entity: Entity, x: number, y: number) {
    let [value] = game[Get.Draw][entity].Args as [number];
    let lifespan = game[Get.Lifespan][entity];
    let relative = lifespan.Age / lifespan.Max;
    game.Context.font = `${value / 125 + 1}vmin Impact`;
    game.Context.textAlign = "center";
    game.Context.fillStyle = `rgba(255,232,198,${ease_out_quart(1 - relative)})`;
    game.Context.fillText(value.toFixed(0), x, y + -50 - (ease_out_quart(relative) * value) / 5);
}
