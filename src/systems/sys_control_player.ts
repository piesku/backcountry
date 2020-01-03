import {RayTarget} from "../components/com_collide.js";
import {Get, Has} from "../components/com_index.js";
import {find_navigable, Navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = Has.Transform | Has.PlayerControl | Has.Walking;

export function sys_control_player(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY && game.Camera) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    // Player is controllable only in scenes with mouse picking.
    let cursor = game[Get.Select][game.Camera!.EntityId];
    if (game.Input.d0 && cursor.Hit) {
        if (cursor.Hit.Flags & RayTarget.Navigable) {
            let route = get_route(game, entity, game[Get.Navigable][cursor.Hit.EntityId]);
            if (route) {
                game[Get.Walking][entity].Route = route;
            }
        }

        if (cursor.Hit.Flags & RayTarget.Attackable && game.World[entity] & Has.Shoot) {
            let other_transform = game[Get.Transform][cursor.Hit.EntityId];
            game[Get.Shoot][entity].Target = get_translation([], other_transform.World);
            game[Get.Shake][game.Camera!.EntityId].Duration = 0.2;
        }
    }

    if (game.Input.d2 && game.World[entity] & Has.Shoot) {
        game[Get.Shoot][entity].Target = cursor.Position;
        game[Get.Shake][game.Camera!.EntityId].Duration = 0.2;
    }
}

export function get_neighbors(game: Game, {X, Y}: {X: number; Y: number}) {
    let directions = [
        {X: X - 1, Y}, // w
        {X: X + 1, Y}, // e
        {X, Y: Y - 1}, // n
        {X, Y: Y + 1},
        {X: X - 1, Y: Y - 1}, // nw
        {X: X + 1, Y: Y - 1}, // ne
        {X: X - 1, Y: Y + 1}, // sw
        {X: X + 1, Y: Y + 1},
    ];

    // if (diagonal) {
    //     directions.push(

    //     );
    // }

    return directions.filter(
        ({X, Y}) => X >= 0 && X < game.Grid.length && Y >= 0 && Y < game.Grid[0].length
    );
}

export function calculate_distance(game: Game, {X, Y}: {X: number; Y: number}) {
    // Reset the distance grid.
    for (let x = 0; x < game.Grid.length; x++) {
        for (let y = 0; y < game.Grid[0].length; y++) {
            if (!Number.isNaN(game.Grid[x][y])) {
                game.Grid[x][y] = Infinity;
            }
        }
    }
    game.Grid[X][Y] = 0;
    let frontier = [{X, Y}];
    let current;
    while ((current = frontier.shift())) {
        if (game.Grid[current.X][current.Y] < 15) {
            for (let cell of get_neighbors(game, current)) {
                if (game.Grid[cell.X][cell.Y] > game.Grid[current.X][current.Y] + 1) {
                    game.Grid[cell.X][cell.Y] = game.Grid[current.X][current.Y] + 1;
                    frontier.push(cell);
                }
            }
        }
    }
}

export function get_route(game: Game, entity: Entity, destination: Navigable) {
    let walking = game[Get.Walking][entity];
    calculate_distance(game, walking);

    // Bail out early if the destination is not accessible (Infinity) or non-walkable (NaN).
    if (!(game.Grid[destination.X][destination.Y] < Infinity)) {
        return false;
    }

    let route: Array<{X: number; Y: number}> = [];
    while (!(destination.X == walking.X && destination.Y == walking.Y)) {
        route.push(destination);

        let neighbors = get_neighbors(game, destination);

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor_coords = neighbors[i];
            if (
                game.Grid[neighbor_coords.X][neighbor_coords.Y] <
                game.Grid[destination.X][destination.Y]
            ) {
                destination = game[Get.Navigable][find_navigable(game, neighbor_coords)];
            }
        }
    }

    return route;
}
