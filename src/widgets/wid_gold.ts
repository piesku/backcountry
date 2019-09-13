import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {ease_out_quart} from "../math/easing.js";

export function widget_gold(game: Game, entity: Entity, x: number, y: number) {
    let value = game[Get.Draw][entity].Arg as number;
    let lifespan = game[Get.Lifespan][entity];
    let relative = lifespan.Age / lifespan.Max;
    game.Context.font = "10vmin Impact";
    game.Context.fillStyle = `rgba(255,255,0,${ease_out_quart(1 - relative)})`;
    game.Context.fillText(
        `+ $${value.toLocaleString("en")}`,
        x + 100,
        y - ease_out_quart(relative) * 150
    );
}
