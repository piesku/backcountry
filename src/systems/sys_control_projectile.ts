import {Get, Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_forward} from "../math/mat4.js";

const QUERY = Has.Transform | Has.Collide | Has.Move | Has.Projectile;

export function sys_control_projectile(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let projectile = game[Get.Projectile][entity];
    let move = game[Get.Move][entity];
    let collide = game[Get.Collide][entity];

    if (collide.Collisions.length > 0) {
        game.Destroy(entity);
        for (let collider of collide.Collisions) {
            if (game.World[collider.EntityId] & Has.Health) {
                game[Get.Health][collider.EntityId].Damage =
                    Math.random() * projectile.Damage + Math.random() * projectile.Damage;
            }
        }
    } else {
        // Always move in the projectile's front direction.
        move.Direction = get_forward([], game[Get.Transform][entity].World);
    }
}
