import {light} from "../components/com_light.js";
import {mimic} from "../components/com_mimic.js";
import {Entity, Game} from "../game.js";
import {Blueprint} from "./blu_common";
import {get_hat_blueprint} from "./blu_hat.js";

export function create_reward(game: Game, target: Entity) {
    return <Blueprint>{
        Using: [light([1, 1, 1], 5), mimic(target)],
        Children: [get_hat_blueprint(game)],
    };
}
