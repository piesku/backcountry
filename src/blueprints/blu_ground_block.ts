import { render_vox } from "../components/com_render_vox.js";
import { Game } from "../game.js";
import { from_euler } from "../math/quat.js";
import { Model } from "../model.js";
import { Blueprint } from "./blu_common.js";

let palette = [
    0.6, 0.4, 0
];

export function get_block_blueprint(game: Game): Blueprint {
    let model = create_model();

    return {
        translation: [0, model.size[1] / 2 + 1, 0],
        rotation: from_euler([], 0, ~~(Math.random() * 4) * 90, 0),
        using: [(game: Game) => render_vox(model, palette)(game)],
    };
}

function create_model() {
    let size = [1, 1, 1], number_of_elements = ~~(Math.random() * 3) + 1;
    let offsets = [];

    for (let x = 0; x < number_of_elements; x++) {
        let y = ~~(Math.random() * 2) - 1
        if (y > 0) {
            size[2]++;
        } else if (y < 0) {
            size[2]++;
        }

        offsets.push(
            x,
            0,
            y,
            0
        );

        if (Math.random() < 0.3 && size[1] != 2) {
            size[1] = 2;
            offsets.push(
                x,
                1,
                y,
                0
            );
        }


    }

    return {
        offsets: Float32Array.from(offsets),
        size,
    } as Model;
}
