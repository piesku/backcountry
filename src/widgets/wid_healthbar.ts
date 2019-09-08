import {Get} from "../components/com_index";
import {Entity, Game} from "../game";

export function widget_healthbar(game: Game, entity: Entity, x: number, y: number) {
    // Health bars must be direct children of character containers.
    let parent = game[Get.Transform][entity].Parent!.Entity;
    let health = game[Get.Health][parent];
    game.Context.fillStyle = "#0f0";
    game.Context.fillRect(
        x - 0.05 * game.Canvas2.width,
        y,
        (0.1 * game.Canvas2.width * health.Current) / health.Max,
        0.01 * game.Canvas2.height
    );
}
