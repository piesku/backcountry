import { Get } from "../components/com_index.js";
import { find_navigable } from "../components/com_navigable.js";
import { RayCast } from "../components/com_ray_cast.js";
import { RayFlag, ray_target } from "../components/com_ray_target.js";
import { render_basic } from "../components/com_render_basic.js";
import { Entity, Game } from "../game.js";
import { Mat } from "../materials/mat_index.js";
import { Cube } from "../shapes/Cube.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Shoot) | (1 << Get.PlayerControl);

export function sys_player_control(game: Game, delta: number) {
    let camera = game.cameras[0];
    if (game.world[camera.entity] & (1 << Get.RayCast)) {
        let cursor = game[Get.RayCast][camera.entity];
        for (let i = 0; i < game.world.length; i++) {
            if ((game.world[i] & QUERY) === QUERY) {
                update(game, i, cursor);
            }
        }
    }
}

function update(game: Game, entity: Entity, cursor: RayCast) {
    if (!cursor.hit) {
        return;
    }

    if (game.event.mouse_0_down) {
        if (cursor.hit.other.flags & RayFlag.Navigable) {
            // let destination = game[Get.Transform][ray.hit.other.entity].translation;
            let route_entity = cursor.hit.other.entity;
            let route_navigable = game[Get.Navigable][route_entity];
            let route: any = [game[Get.Transform][route_entity].translation];

            // TODO: calculate the route, set 1st destination & final destination
            // (or just route?)
            let player_x = player_control.x;
            let player_y = player_control.y;

            game.distance_field[player_x][player_y] = 0;

            calculate_distance(game, player_x, player_y);

            while (!(route_navigable.x === player_x && route_navigable.y === player_y)) {
                route.push(game[Get.Transform][route_entity].translation);
                game.add({
                    translation: game[Get.Transform][route_entity].translation,
                    scale: [1, 5, 1],
                    using: [
                        render_basic(game.materials[Mat.Wireframe], Cube, [0.3, 1, 1, 1]),
                        ray_target(RayFlag.None),
                    ],
                });

                let neighbors = get_neighbors(game, route_navigable.x, route_navigable.y);

                for (let i = 0; i < neighbors.length; i++) {
                    let neighbor_coords = neighbors[i];
                    // let neighbor_entity = find_navigable(game, neighbor_coords.x, neighbor_coords.y);
                    if (game.distance_field[neighbor_coords.x][neighbor_coords.y] < game.distance_field[route_navigable.x][route_navigable.y]) {
                        route_entity = find_navigable(game, neighbor_coords.x, neighbor_coords.y);
                        route_navigable = game[Get.Navigable][route_entity];
                        console.log('go:', neighbor_coords.x, neighbor_coords.y);
                    }
                }
            }

            // console.log(route);

            game[Get.ClickControl][entity].route = route;

            // game[Get.ClickControl][entity].destination = route.pop();

            // game.add({
            //     translation: destination,
            //     scale: [1, 5, 1],
            //     using: [
            //         render_basic(game.materials[Mat.Wireframe], Cube, [0.3, 1, 1, 1]),
            //         ray_target(RayFlag.None),
            //     ],
            // });
        }
    }

    if (game.event.mouse_2_down) {
        game[Get.Shoot][entity].target = cursor.hit.contact;
    }
}

function get_neighbors(game: Game, x: number, y: number) {
    return [
        { x: x - 1, y }, // W
        { x: x + 1, y }, // E
        { x, y: y - 1 }, // N
        { x, y: y + 1 }, // S
    ].filter(({ x, y }) => (x >= 0 && x < game.distance_field.length && y >= 0 && y < game.distance_field[0].length));
}

function calculate_distance(game: Game, x: number, y: number) {
    let neighbors = get_neighbors(game, x, y);
    // console.log(neighbors);
    for (let i = 0; i < neighbors.length; i++) {
        let current_cell = neighbors[i];
        // console.log(game.distance_field[x][y], game.distance_field[current_cell.x][current_cell.y], (game.distance_field[x][y] as number) + 1);
        if (game.distance_field[current_cell.x][current_cell.y] > (game.distance_field[x][y] as number) + 1) {
            game.distance_field[current_cell.x][current_cell.y] = (game.distance_field[x][y] as number) + 1;
            calculate_distance(game, current_cell.x, current_cell.y);
        }
    }
}
