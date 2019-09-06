import {Action} from "../actions.js";
import {collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {light} from "../components/com_light.js";
import {mimic} from "../components/com_mimic.js";
import {trigger} from "../components/com_trigger.js";
import {Entity, Game} from "../game.js";
import {Blueprint} from "./blu_common";
import {get_hat_blueprint} from "./blu_hat.js";

export function create_reward(game: Game, target: Entity) {
    return <Blueprint>{
        Using: [
            light([1, 1, 1], 8),
            mimic(target, 0.01),
            collide(true),
            trigger(1 << Get.PlayerControl, Action.CollectHat),
        ],
        Children: [get_hat_blueprint(game)],
    };
}
