import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {ease_in_cubic} from "../math/easing.js";

export function widget_player_hit(game: Game, entity: Entity, x: number, y: number) {
    let lifespan = game[Get.Lifespan][entity];
    let opacity = 0.4 * ease_in_cubic(1 - lifespan.Age / lifespan.Max);
    game.Context.fillStyle = `rgba(255,79,79,${opacity})`;
    game.Context.fillRect(0, 0, game.Canvas2.width, game.Canvas2.height);
}
