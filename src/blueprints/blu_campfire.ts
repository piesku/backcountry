import {Action} from "../actions.js";
import {collide} from "../components/com_collide.js";
import {cull} from "../components/com_cull.js";
import {emit_particles} from "../components/com_emit_particles.js";
import {Has} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {render_particles} from "../components/com_render_particles.js";
import {render_vox} from "../components/com_render_vox.js";
import {shake} from "../components/com_shake.js";
import {trigger} from "../components/com_trigger.js";
import {Game} from "../game.js";
import {Models} from "../models_map.js";
import {Blueprint} from "./blu_common.js";

export function get_campfire_blueprint(game: Game): Blueprint {
    return {
        Translation: [0, 1.5, 0],
        Using: [render_vox(game.Models[Models.CAMPFIRE]), cull(Has.Render)],
        Children: [
            {
                Using: [
                    collide(false, [15, 15, 15]),
                    trigger(Action.HealCampfire),
                    cull(Has.Collide | Has.Trigger),
                ],
                Children: [
                    {
                        Using: [
                            shake(Infinity),
                            emit_particles(2, 0.1),
                            render_particles([1, 0, 0], 15),
                            cull(Has.Shake | Has.EmitParticles | Has.Render),
                        ],
                    },
                    {
                        Translation: [0, 3, 0],
                        Using: [light([1, 0.5, 0], 3), cull(Has.Light)],
                    },
                ],
            },
        ],
    };
}
