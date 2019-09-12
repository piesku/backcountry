import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export function create_gun(game: Game) {
    return <Blueprint>{
        // Rotation: from_euler([], 270, 0, 0),
        Rotation: [0.7, 0, 0, -0.7],
        Translation: [
            0,
            -3, // -(game.Models[Models.GUN1].Size![1] / 2 + game.Models[Models.HAND].Size![1] / 2),
            0,
        ],
        Using: [render_vox(game.Models[Models.GUN1])],
    };
}
