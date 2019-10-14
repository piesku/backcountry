import {Get, Has} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {integer} from "../math/random.js";
import {get_neighbors, get_route} from "./sys_player_control.js";

const QUERY = Has.Transform | Has.NPC | Has.Walking;

export function sys_ai(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let walking = game[Get.Walking][entity];
    let is_friendly = game[Get.NPC][entity].Friendly;
    let can_shoot = game[Get.NPC][entity].LastShot <= 0;
    let player_walking = game[Get.Walking][game.Player!];
    let distance_to_player = Math.abs(
        game.Grid[walking.X][walking.Y] - game.Grid[player_walking.X][player_walking.Y]
    );
    let route: false | Array<{X: number; Y: number}> = [];

    if (!walking.Route.length && !walking.Destination) {
        if (is_friendly || distance_to_player > 5) {
            let destination_depth = integer(1, 15);
            while (destination_depth == game.Grid[walking.X][walking.Y]) {
                destination_depth = integer(1, 15);
            }

            route = get_random_route(game, entity, destination_depth);
        } else {
            route = get_route(game, game.Player!, walking);

            if (route) {
                route.pop();
                route.pop();
                route = route.reverse();
            }
        }

        if (route && route.length > 1) {
            walking.Route = route;
        }
    }

    if (!is_friendly && game.World[entity] & Has.Shoot) {
        if (distance_to_player < 4 && can_shoot) {
            game[Get.Shoot][entity].Target = game[Get.Transform][game.Player!].Translation;
            game[Get.NPC][entity].LastShot = 0.5;
            walking.Route = [];
        } else {
            game[Get.NPC][entity].LastShot -= delta;
        }
    }
}

function get_random_route(game: Game, entity: Entity, destination_depth: number) {
    let walking = game[Get.Walking][entity];
    let current_cell = game[Get.Navigable][find_navigable(game, walking)];
    let current_depth = game.Grid[walking.X][walking.Y];
    let modifier = destination_depth > current_depth ? 1 : -1;

    let route: Array<{X: number; Y: number}> = [];

    if (!(current_depth < 16)) {
        return false;
    }

    while (destination_depth !== current_depth) {
        if (route.length > 10) {
            return false;
        }

        route.push(current_cell);

        let neighbors = get_neighbors(game, current_cell).sort(() => 0.5 - Math.random());

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor_coords = neighbors[i];
            if (game.Grid[neighbor_coords.X][neighbor_coords.Y] == current_depth + 1 * modifier) {
                current_cell = game[Get.Navigable][find_navigable(game, neighbor_coords)];
                current_depth = game.Grid[current_cell.X][current_cell.Y];
                break;
            }
        }
    }

    return route.reverse();
}
