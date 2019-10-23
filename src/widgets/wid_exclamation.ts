import {Get} from "../components/com_index";
import {Entity, Game} from "../game";

export function widget_exclamation(game: Game, entity: Entity) {
    let marker = game[Get.Draw][entity].Arg as string;
    let age = game[Get.Lifespan][entity].Age;
    game.Context.font = "10vmin Impact";
    game.Context.textAlign = "center";
    game.Context.fillStyle = "#FFE8C6";
    game.Context.fillText(marker, 0, Math.sin(age * 5) * 10);
}
