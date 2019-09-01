import {Get} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {integer} from "../math/random.js";
import {get_neighbors} from "./sys_player_control.js";

const QUERY = (1 << Get.Transform) | (1 << Get.NPC) | (1 << Get.Walking) | (1 << Get.PathFind);

export function sys_ai(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let path_find = game[Get.PathFind][entity];
    let walking = game[Get.Walking][entity];

    if (!path_find.Route.length) {
        let destination_depth = integer(1, 15);
        while (destination_depth === game.grid[walking.X][walking.Y]) {
            destination_depth = integer(1, 15);
        }

        let route = get_route(game, entity, destination_depth);
        if (route) {
            path_find.Route = route;
        }
    }
}

function get_route(game: Game, entity: Entity, destination_depth: number) {
    let walking = game[Get.Walking][entity];
    let current_cell = game[Get.Navigable][find_navigable(game, walking.X, walking.Y)];
    let current_depth = game.grid[walking.X][walking.Y];
    let modifier = destination_depth > current_depth ? 1 : -1;

    let route: Array<[number, number]> = [];

    if (!(current_depth < 16)) {
        return false;
    }

    while (destination_depth !== current_depth) {
        if (route.length > 10) {
            destination_depth = integer(1, 15);
            current_depth = game.grid[walking.X][walking.Y];
            modifier = destination_depth > current_depth ? 1 : -1;
        }

        route.push([current_cell.X, current_cell.Y]);

        let neighbors = get_neighbors(game, current_cell.X, current_cell.Y, walking.Diagonal).sort(
            () => 0.5 - Math.random()
        );

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor_coords = neighbors[i];
            if (
                game.grid[neighbor_coords.x][neighbor_coords.y] ===
                current_depth + 1 * modifier
                //  ||
                // game.grid[neighbor_coords.x][neighbor_coords.y] === current_depth
            ) {
                current_cell =
                    game[Get.Navigable][find_navigable(game, neighbor_coords.x, neighbor_coords.y)];
                current_depth = game.grid[current_cell.X][current_cell.Y];
                break;
            }
        }
    }

    return route.reverse();
}
