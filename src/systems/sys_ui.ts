import {Get} from "../components/com_index.js";
import {Game} from "../game.js";
import {App} from "../ui/App.js";

let prev: string;

export function sys_ui(game: Game, delta: number) {
    let next = App(game);
    if (next !== prev) {
        game.UI.innerHTML = prev = next;
    }

    for (let i = 0; i < game.World.length; i++) {
        if (game.World[i] & (1 << Get.UI)) {
            let ui = game[Get.UI][i];
            if (ui.Lifespan < 0) {
                ui.Element.remove();
            } else {
                ui.Lifespan -= delta;
            }
        }
    }
}
