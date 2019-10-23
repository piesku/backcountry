import {Get} from "../components/com_index";
import {Entity, Game} from "../game";

export function widget_distance(game: Game, entity: Entity, x: number, y: number) {
    let {X, Y} = game[Get.Navigable][entity];
    let score = game.Grid[X][Y];

    game.Context.setTransform(1, 0, 0, 1, x, y);
    game.Context.scale(1, Math.tan(Math.PI / 6));
    game.Context.rotate(Math.PI / 4);

    if (!Number.isNaN(score) && Number.isFinite(score)) {
        game.Context.fillStyle = `hsla(
        ${(score * 255) / 15}, 100%, 50%, ${0.2 - score / 75}`;
        game.Context.fillRect(-40, -40, 80, 80);
    }

    game.Context.font = "3vmin monospace";
    game.Context.textAlign = "center";
    game.Context.fillStyle = "#fff";
    game.Context.fillText(score.toString(), 0, 0);
}
