import { render_vox } from "../components/com_render_vox.js";
import { Game } from "../game.js";
import { create_line } from "./blu_tools.js";

export function get_building_blueprint(game: Game) {
    let building_size = [
        10 + Math.random() * 12,
        10 + Math.random() * 12,
        10 + Math.random() * 12,
    ];

    let offsets: number[] = create_line([0, 0, 0], [0, 10, 0], 0);

    console.log(offsets);

    return {
        // rotation: from_euler([], 270, 0, 0),
        translation: [
            0,
            0,
            0,
        ],
        using: [render_vox({
            offsets: Float32Array.from(offsets),
            size: [1, 1, 1]
            // }, [0.6, 0.4, 0])],
        }, [0, 1, 0])],
    };
}
