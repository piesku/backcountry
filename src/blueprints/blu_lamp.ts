import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export const lamp_blueprint = <Blueprint>{
    children: [
        {
            translation: [0, 0, 4.5],
            using: [(game: Game) => render_vox(game.models[Models.LAMP])(game), cull(Get.Render)],
        },
        {
            translation: [0, 1, 7],
            using: [cull(Get.Light), light([1, 0.5, 0], 5)],
        },
    ],
};
