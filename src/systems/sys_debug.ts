import {Collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {RenderKind} from "../components/com_render.js";
import {render_basic} from "../components/com_render_basic.js";
import {Shoot} from "../components/com_shoot.js";
import {Transform} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {get_translation} from "../math/mat4.js";
import {Cube} from "../shapes/Cube.js";
import {Line} from "../shapes/Line.js";

interface Wireframe {
    anchor: Transform;
    transform: Transform;
}
const wireframes: Map<Transform | Collide | Shoot, Wireframe> = new Map();

export function sys_debug(game: Game, delta: number) {
    // Prune wireframes corresponding to destroyed entities.
    for (let [key, wireframe] of wireframes) {
        if (
            // If the entity doesn't have TRANSFORM...
            !(game.world[wireframe.anchor.entity] & (1 << Get.Transform)) ||
            // ...or if it's not the same TRANSFORM.
            game[Get.Transform][wireframe.anchor.entity] !== wireframe.anchor
        ) {
            game.destroy(wireframe.transform.entity);
            wireframes.delete(key);
        }
    }

    for (let i = 0; i < game.world.length; i++) {
        if (game.world[i] & (1 << Get.Transform)) {
            // Draw colliders first. If the collider's wireframe overlaps
            // exactly with the transform's wireframe, we want the collider to
            // take priority.
            if (game.world[i] & (1 << Get.Collide)) {
                wireframe_collider(game, i);
            }

            // Draw invisible entities.
            if (!(game.world[i] & (1 << Get.Render))) {
                wireframe_entity(game, i);
            } else if (game[Get.Render][i].Kind === RenderKind.Particles) {
                wireframe_entity(game, i);
            }

            if (game.world[i] & (1 << Get.Shoot)) {
                wireframe_ray(game, i);
            }
        }
    }
}

function wireframe_entity(game: Game, entity: Entity) {
    let anchor = game[Get.Transform][entity];
    let wireframe = wireframes.get(anchor);

    if (!wireframe) {
        let box = game.add({
            using: [render_basic(game.materials[Mat.Wireframe], Cube, [1, 0, 1, 1])],
        });
        let wireframe_transform = game[Get.Transform][box];
        wireframe_transform.world = anchor.world;
        wireframe_transform.dirty = false;
        wireframes.set(anchor, {
            anchor: anchor,
            transform: wireframe_transform,
        });
    }
}

function wireframe_collider(game: Game, entity: Entity) {
    let anchor = game[Get.Transform][entity];
    let collide = game[Get.Collide][entity];
    let wireframe = wireframes.get(collide);

    if (!wireframe) {
        let box = game.add({
            translation: get_translation([], anchor.world),
            scale: collide.Size,
            using: [render_basic(game.materials[Mat.Wireframe], Cube, [0, 1, 0, 1])],
        });
        wireframes.set(collide, {
            anchor,
            transform: game[Get.Transform][box],
        });
    } else if (collide.Dynamic) {
        get_translation(wireframe.transform.translation, anchor.world);
        wireframe.transform.dirty = true;
    }
}

function wireframe_ray(game: Game, entity: Entity) {
    let anchor = game[Get.Transform][entity];
    let shoot = game[Get.Shoot][entity];
    let wireframe = wireframes.get(shoot);

    if (!wireframe) {
        let line = game.add({
            using: [render_basic(game.materials[Mat.Wireframe], Line, [1, 1, 0, 1])],
        });
        let wireframe_transform = game[Get.Transform][line];
        wireframe_transform.world = anchor.world;
        wireframe_transform.dirty = false;
        wireframes.set(shoot, {
            anchor: anchor,
            transform: wireframe_transform,
        });
    }
}
