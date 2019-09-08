import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface UI {
    Element: HTMLElement;
}

export function ui(html: string) {
    return (game: Game, entity: Entity) => {
        let Element = document.createElement("p");
        Element.innerHTML = html;
        game.UI3D.appendChild(Element);
        game.World[entity] |= 1 << Get.UI;
        return (game[Get.UI][entity] = <UI>{
            Element,
        });
    };
}
