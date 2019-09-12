import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {ease_out_quart} from "../math/easing.js";

export function widget_value(game: Game, entity: Entity, x: number, y: number) {
    let [value, prefix = ""] = game[Get.Draw][entity].Args as [number, string?];
    let lifespan = game[Get.Lifespan][entity];
    let relative = lifespan.Age / lifespan.Max;
    game.Context.font = `${value / 125 + 1}vmin Impact`;
    game.Context.textAlign = "center";
    game.Context.fillStyle = `rgba(255,${prefix ? "255,0" : "232,198"},${ease_out_quart(
        1 - relative
    )})`;
    game.Context.fillText(
        prefix + value.toFixed(0),
        prefix ? x + 100 : x,
        y - 50 - (ease_out_quart(relative) * value) / 5
    );
}
