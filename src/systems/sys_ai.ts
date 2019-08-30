import {Get} from "../components/com_index.js";
import {find_navigable} from "../components/com_navigable.js";
import {Entity, Game} from "../game.js";
import {get_route} from "./sys_player_control.js";

const QUERY =
    (1 << Get.Transform) |
    (1 << Get.Shoot) |
    (1 << Get.NPC) |
    (1 << Get.Walking) |
    (1 << Get.PathFind);

export function sys_ai(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let path_find = game[Get.PathFind][entity];

    if (path_find.route.length === 0) {
        let x = ~~(Math.random() * game.grid.length);
        let y = ~~(Math.random() * game.grid.length);
        while (!(game.grid[x][y] < Infinity)) {
            let route = get_route(game, entity, game[Get.Navigable][find_navigable(game, x, y)]);
            if (route) {
                path_find.route = route;
            }
        }
    }
}
