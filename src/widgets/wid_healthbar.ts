import {Entity, Game} from "../game";

export function widget_healthbar(game: Game, entity: Entity, x: number, y: number) {
    game.Context.fillStyle = "#0f0";
    game.Context.fillRect(x - 100, y, 200, 10);
}
