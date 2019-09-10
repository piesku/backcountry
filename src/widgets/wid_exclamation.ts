import {Get} from "../components/com_index";
import {Entity, Game} from "../game";

export function widget_exclamation(game: Game, entity: Entity, x: number, y: number) {
    let age = game[Get.Lifespan][entity].Age;
    game.Context.font = "10vmin Impact";
    game.Context.textAlign = "center";
    game.Context.fillStyle = "#FFE8C6";
    game.Context.fillText("!", x, y + Math.sin(age * 5) * 10);
}
