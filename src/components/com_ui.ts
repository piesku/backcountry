import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface UI {
    Element: HTMLElement;
    Lifespan: number;
}

export function ui(html: string, Lifespan = 1) {
    return (game: Game) => (entity: Entity) => {
        let Element = document.createElement("p");
        Element.innerHTML = html;
        game.UI.appendChild(Element);
        game.World[entity] |= 1 << Get.UI;
        return (game[Get.UI][entity] = <UI>{
            Element,
            Lifespan,
        });
    };
}
