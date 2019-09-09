import {Get} from "../components/com_index";
import {Entity, Game} from "../game";

export function widget_healthbar(game: Game, entity: Entity, x: number, y: number) {
    // Health bars must be direct children of character containers.
    let parent = game[Get.Transform][entity].Parent!.EntityId;
    let health = game[Get.Health][parent];
    let height = 0.01 * game.Canvas2.height;
    if (game.World[parent] & (1 << Get.PlayerControl)) {
        game.Context.fillStyle = "#0f0";
    } else if (game.World[parent] & (1 << Get.NPC) && game[Get.NPC][parent].Bounty) {
        game.Context.fillStyle = "#ff0";
        height *= 2;
    } else {
        game.Context.fillStyle = "#f00";
    }
    game.Context.fillRect(
        x - 0.05 * game.Canvas2.width,
        y,
        (0.1 * game.Canvas2.width * health.Current) / health.Max,
        height
    );
}
