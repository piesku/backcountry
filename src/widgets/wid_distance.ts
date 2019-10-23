import {Get} from "../components/com_index";
import {Entity, Game} from "../game";

export function widget_distance(game: Game, entity: Entity, x: number, y: number) {
    let {X, Y} = game[Get.Navigable][entity];
    let score = game.Grid[X][Y];

    game.Context.font = "2vmin monospace";
    game.Context.textAlign = "center";
    game.Context.fillStyle = "#fff";
    game.Context.fillText(score.toString(), x, y);
}
