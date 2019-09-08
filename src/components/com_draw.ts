import {Entity, Game} from "../game.js";
import {Widget} from "../widgets/wid_common.js";
import {Get} from "./com_index.js";

export interface Draw {
    Widget: Widget;
    Args: Array<unknown>;
}

export function draw(Widget: Widget, Args: Array<unknown> = []) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Draw;
        game[Get.Draw][entity] = <Draw>{
            Widget,
            Args,
        };
    };
}
