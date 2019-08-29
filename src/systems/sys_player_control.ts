import {Animate} from "../components/com_animate.js";
import {AudioSource} from "../components/com_audio_source.js";
import {Get} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {RayFlag} from "../components/com_ray_target.js";
import {Select} from "../components/com_select.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {get_translation} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Shoot) | (1 << Get.PlayerControl);

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
            let player_control = game[Get.PlayerControl][entity];
            let route_entity = cursor.hit.other.entity;
            let route_navigable = game[Get.Navigable][route_entity];
            let route: any = [];

            let player_x = player_control.x;
            let player_y = player_control.y;

            // reset the depth field
            for (let x = 0; x < game.distance_field.length; x++) {
                for (let y = 0; y < game.distance_field[0].length; y++) {
                    if (typeof game.distance_field[x][y] === "number") {
                        game.distance_field[x][y] = Infinity;
                    }
                }
            }
            game.distance_field[player_x][player_y] = 0;
            calculate_distance(game, player_x, player_y, player_control.diagonal);
            if (game.distance_field[route_navigable.x][route_navigable.y] === Infinity) {
                return;
            }

            while (!(route_navigable.x === player_x && route_navigable.y === player_y)) {
                route.push([route_navigable.x, route_navigable.y]);

                let neighbors = get_neighbors(
                    game,
                    route_navigable.x,
                    route_navigable.y,
                    player_control.diagonal
                );

                for (let i = 0; i < neighbors.length; i++) {
                    let neighbor_coords = neighbors[i];
                    if (
                        game.distance_field[neighbor_coords.x][neighbor_coords.y] <
                        game.distance_field[route_navigable.x][route_navigable.y]
                    ) {
                        route_entity = find_navigable(game, neighbor_coords.x, neighbor_coords.y);
                        route_navigable = game[Get.Navigable][route_entity];
                    }
                }
            }

            game[Get.ClickControl][entity].route = route;
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
        ({x, y}) =>
            x >= 0 && x < game.distance_field.length && y >= 0 && y < game.distance_field[0].length
    );
}

function calculate_distance(game: Game, x: number, y: number, diagonal: boolean) {
    let frontier = [{x, y}];
    let current;
    while ((current = frontier.shift())) {
        for (let cell of get_neighbors(game, current.x, current.y, diagonal)) {
            if (
                game.distance_field[cell.x][cell.y] >
                (game.distance_field[current.x][current.y] as number) + 1
            ) {
                game.distance_field[cell.x][cell.y] =
                    (game.distance_field[current.x][current.y] as number) + 1;
                frontier.push(cell);
            }
        }
    }
}
