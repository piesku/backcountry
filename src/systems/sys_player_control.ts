import { Get } from "../components/com_index.js";
import { RayCast } from "../components/com_ray_cast.js";
import { RayFlag } from "../components/com_ray_target.js";
import { Entity, Game } from "../game.js";

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
            let destination = game[Get.Transform][cursor.hit.other.entity].translation;
            game[Get.ClickControl][entity].destination = destination;

            game.add({
                translation: destination,
                scale: [1, 5, 1],
                using: [
                    render_basic(game.materials[Mat.Wireframe], Cube, [0.3, 1, 1, 1]),
                    ray_target(RayFlag.None),
                ],
            });
        }
        if (cursor.hit.other.flags & RayFlag.Attackable) {
            game[Get.Shoot][entity].target = cursor.hit.contact;
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
    console.log(neighbors);
    for (let i = 0; i < neighbors.length; i++) {
        let current_cell = neighbors[i];
        console.log(game.distance_field[x][y], game.distance_field[current_cell.x][current_cell.y], (game.distance_field[x][y] as number) + 1);
        if (game.distance_field[current_cell.x][current_cell.y] > (game.distance_field[x][y] as number) + 1) {
            game.distance_field[current_cell.x][current_cell.y] = (game.distance_field[x][y] as number) + 1;
            calculate_distance(game, current_cell.x, current_cell.y);
        }
    }
}
