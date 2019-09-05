import {collide} from "../components/com_collide.js";
import {light} from "../components/com_light.js";
import {mimic} from "../components/com_mimic.js";
import {trigger_world} from "../components/com_trigger.js";
import {Entity, Game} from "../game.js";
import {Blueprint} from "./blu_common";
import {get_hat_blueprint} from "./blu_hat.js";

export function create_reward(game: Game, target: Entity) {
    return <Blueprint>{
        Using: [light([1, 1, 1], 8), mimic(target, 0.01), collide(true), trigger_world("intro")],
        Children: [get_hat_blueprint(game)],
    };
}
