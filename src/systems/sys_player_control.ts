import {RayTarget} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {find_navigable, Navigable} from "../components/com_navigable.js";
import {Select} from "../components/com_select.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.PlayerControl) | (1 << Get.Walking);

export function sys_player_control(game: Game, delta: number) {
    if (game.World[game.Camera!.EntityId] & (1 << Get.Select)) {
        let cursor = game[Get.Select][game.Camera!.EntityId];
        for (let i = 0; i < game.World.length; i++) {
            if ((game.World[i] & QUERY) === QUERY) {
                update(game, i, cursor);
            }
        }
    }
}

function update(game: Game, entity: Entity, cursor: Select) {
    if (game.Input.d0 && cursor.Hit) {
        if (cursor.Hit.Flags & RayTarget.Navigable) {
            let route = get_route(game, entity, game[Get.Navigable][cursor.Hit.EntityId]);
            if (route) {
                game[Get.Walking][entity].Route = route;
            }
        }

        if (cursor.Hit.Flags & RayTarget.Attackable && game.World[entity] & (1 << Get.Shoot)) {
            let other_transform = game[Get.Transform][cursor.Hit.EntityId];
            game[Get.Shoot][entity].Target = get_translation([], other_transform.World);
            game[Get.Shake][game.Camera!.EntityId].Duration = 0.2;
        }
    }

    if (game.Input.d2 && game.World[entity] & (1 << Get.Shoot)) {
        game[Get.Shoot][entity].Target = cursor.Position;
        game[Get.Shake][game.Camera!.EntityId].Duration = 0.2;
    }
}

export function get_neighbors(game: Game, x: number, y: number) {
    let directions = [
        {x: x - 1, y}, // W
        {x: x + 1, y}, // E
        {x, y: y - 1}, // N
        {x, y: y + 1},
        {x: x - 1, y: y - 1}, // NW
        {x: x + 1, y: y - 1}, // NE
        {x: x - 1, y: y + 1}, // SW
        {x: x + 1, y: y + 1},
    ];

    // if (diagonal) {
    //     directions.push(

    //     );
    // }

    return directions.filter(
        ({x, y}) => x >= 0 && x < game.Grid.length && y >= 0 && y < game.Grid[0].length
    );
}

export function calculate_distance(game: Game, x: number, y: number) {
    let frontier = [{x, y}];
    let current;
    while ((current = frontier.shift())) {
        if (game.Grid[current.x][current.y] < 15) {
            for (let cell of get_neighbors(game, current.x, current.y)) {
                if (game.Grid[cell.x][cell.y] > game.Grid[current.x][current.y] + 1) {
                    game.Grid[cell.x][cell.y] = game.Grid[current.x][current.y] + 1;
                    frontier.push(cell);
                }
            }
        }
    }
}

export function get_route(game: Game, entity: Entity, destination: Navigable) {
    let walking = game[Get.Walking][entity];

    // reset the depth field
    for (let x = 0; x < game.Grid.length; x++) {
        for (let y = 0; y < game.Grid[0].length; y++) {
            if (!Number.isNaN(game.Grid[x][y])) {
                game.Grid[x][y] = Infinity;
            }
        }
    }
    game.Grid[walking.X][walking.Y] = 0;
    calculate_distance(game, walking.X, walking.Y);

    // Bail out early if the destination is not accessible (Infinity) or non-walkable (NaN).
    if (!(game.Grid[destination.X][destination.Y] < Infinity)) {
        return false;
    }

    let route: Array<[number, number]> = [];
    while (!(destination.X === walking.X && destination.Y === walking.Y)) {
        route.push([destination.X, destination.Y]);

        let neighbors = get_neighbors(game, destination.X, destination.Y);

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor_coords = neighbors[i];
            if (
                game.Grid[neighbor_coords.x][neighbor_coords.y] <
                game.Grid[destination.X][destination.Y]
            ) {
                destination =
                    game[Get.Navigable][find_navigable(game, neighbor_coords.x, neighbor_coords.y)];
            }
        }
    }

    return route;
}
