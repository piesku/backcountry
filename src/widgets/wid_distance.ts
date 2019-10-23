import {Get} from "../components/com_index";
import {Entity, Game} from "../game";

export function widget_distance(game: Game, entity: Entity, x: number, y: number) {
    let {X, Y} = game[Get.Navigable][entity];
    let score = game.Grid[X][Y];

    game.Context.setTransform(1, 0, 0, 1, x, y);
    game.Context.scale(1, Math.tan(Math.PI / 6));
    game.Context.rotate(Math.PI / 4);

    game.Context.fillStyle = "rgba(255, 0, 0, 0.3)";
    game.Context.fillRect(-30, -30, 60, 60);

    game.Context.font = "2vmin monospace";
    game.Context.textAlign = "center";
    game.Context.fillStyle = "#fff";
    game.Context.fillText(score.toString(), 0, 0);
}
