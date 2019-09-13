import {Entity, Game} from "../game.js";
import {Widget} from "../widgets/wid_common.js";
import {Get} from "./com_index.js";

export interface Draw {
    Widget: Widget;
    Arg?: unknown;
}

export function draw(Widget: Widget, Arg?: unknown) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Draw;
        game[Get.Draw][entity] = <Draw>{
            Widget,
            Arg,
        };
    };
}
