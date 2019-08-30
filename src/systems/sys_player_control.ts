import {Animate} from "../components/com_animate.js";
import {AudioSource} from "../components/com_audio_source.js";
import {Get} from "../components/com_index.js";
import {find_navigable, Navigable} from "../components/com_navigable.js";
import {RayFlag} from "../components/com_ray_target.js";
import {Select} from "../components/com_select.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY =
    (1 << Get.Transform) |
    (1 << Get.Shoot) |
    (1 << Get.PlayerControl) |
    (1 << Get.Walking) |
    (1 << Get.PathFind);

export function sys_player_control(game: Game, delta: number) {
    let camera = game.cameras[0];
    if (game.world[camera.entity] & (1 << Get.Select)) {
        let cursor = game[Get.Select][camera.entity];
        for (let i = 0; i < game.world.length; i++) {
            if ((game.world[i] & QUERY) === QUERY) {
                update(game, i, cursor);
            }
        }

        if (cursor.hit && (game.event.mouse_0_down || game.event.mouse_2_down)) {
            let transform = game[Get.Transform][cursor.hit.other.entity];
            for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
                animate.trigger = "select";
            }
            for (let audio of components_of_type<AudioSource>(game, transform, Get.AudioSource)) {
                audio.trigger = "select";
            }
        }
    }
}

function update(game: Game, entity: Entity, cursor: Select) {
    if (!cursor.hit) {
        return;
    }

    if (game.event.mouse_0_down) {
        if (cursor.hit.other.flags & RayFlag.Navigable) {
            // reset the depth field
            for (let x = 0; x < game.grid.length; x++) {
                for (let y = 0; y < game.grid[0].length; y++) {
                    if (!Number.isNaN(game.grid[x][y])) {
                        game.grid[x][y] = Infinity;
                    }
                }
            }

            let route = get_route(game, entity, game[Get.Navigable][cursor.hit.other.entity]);
            if (route) {
                game[Get.PathFind][entity].route = route;
            }
        }

        if (cursor.hit.other.flags & RayFlag.Attackable) {
            let other_transform = game[Get.Transform][cursor.hit.other.entity];
            game[Get.Shoot][entity].target = get_translation([], other_transform.world);
        }
    }

    if (game.event.mouse_2_down) {
        game[Get.Shoot][entity].target = cursor.hit.contact;
    }
}

function get_neighbors(game: Game, x: number, y: number, diagonal: boolean) {
    let directions = [
        {x: x - 1, y}, // W
        {x: x + 1, y}, // E
        {x, y: y - 1}, // N
        {x, y: y + 1},
    ];

    if (diagonal) {
        directions.push(
            {x: x - 1, y: y - 1}, // NW
            {x: x + 1, y: y - 1}, // NE
            {x: x - 1, y: y + 1}, // SW
            {x: x + 1, y: y + 1}
        );
    }

    return directions.filter(
        ({x, y}) => x >= 0 && x < game.grid.length && y >= 0 && y < game.grid[0].length
    );
}

function calculate_distance(game: Game, x: number, y: number, diagonal: boolean) {
    let frontier = [{x, y}];
    let current;
    while ((current = frontier.shift())) {
        if (game.grid[current.x][current.y] < 15) {
            for (let cell of get_neighbors(game, current.x, current.y, diagonal)) {
                if (game.grid[cell.x][cell.y] > game.grid[current.x][current.y] + 1) {
                    game.grid[cell.x][cell.y] = game.grid[current.x][current.y] + 1;
                    frontier.push(cell);
                }
            }
        }
    }
}

export function get_route(game: Game, entity: Entity, destination: Navigable) {
    let walking = game[Get.Walking][entity];

    game.grid[walking.x][walking.y] = 0;
    calculate_distance(game, walking.x, walking.y, walking.diagonal);

    // Bail out early if the destination is not accessible (Infinity) or non-walkable (NaN).
    if (!(game.grid[destination.x][destination.y] < Infinity)) {
        return false;
    }

    let route: Array<[number, number]> = [];
    while (!(destination.x === walking.x && destination.y === walking.y)) {
        route.push([destination.x, destination.y]);

        let neighbors = get_neighbors(game, destination.x, destination.y, walking.diagonal);

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor_coords = neighbors[i];
            if (
                game.grid[neighbor_coords.x][neighbor_coords.y] <
                game.grid[destination.x][destination.y]
            ) {
                destination =
                    game[Get.Navigable][find_navigable(game, neighbor_coords.x, neighbor_coords.y)];
            }
        }
    }

    return route;
}
