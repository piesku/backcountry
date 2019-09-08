import {Entity, Game} from "../game";

export function widget_damage(
    game: Game,
    entity: Entity,
    x: number,
    y: number,
    [damage]: Array<unknown>
) {
    game.Context.font = "5vh Impact";
    game.Context.textAlign = "center";
    game.Context.fillStyle = "#ff0";
    game.Context.fillText((damage as number).toFixed(0), x, y);
}
