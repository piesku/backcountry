import {cull} from "../components/com_cull.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {render_vox} from "../components/com_render_vox.js";
import {Game} from "../game.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export const lamp_blueprint = <Blueprint>{
    Children: [
        {
            Translation: [0, 0, 4.5],
            Using: [(game: Game) => render_vox(game.models[Models.LAMP])(game), cull(Get.Render)],
        },
        {
            Translation: [0, 1, 7],
            Using: [cull(Get.Light), light([1, 0.5, 0], 5)],
        },
    ],
};
