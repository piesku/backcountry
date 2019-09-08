import {Entity, Game} from "../game";

export function widget_exclamation(game: Game, entity: Entity, x: number, y: number) {
    game.Context.font = "10vh Impact";
    game.Context.textAlign = "center";
    game.Context.fillStyle = "#fff";
    game.Context.fillText("!", x, y);
}
