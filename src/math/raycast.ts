import {Vec3} from ".";
import {Collide} from "../components/com_collide";
import {Game} from "../game";

export function raycast(game: Game, colliders: Array<Collide>, origin: Vec3, direction: Vec3) {
    let nearest_t = Infinity;
    let nearest_i = null;
    for (let i = 0; i < colliders.length; i++) {
        if (!inside(origin, colliders[i])) {
            let t = distance(origin, direction, colliders[i]);
            if (t < nearest_t) {
                nearest_t = t;
                nearest_i = i;
            }
        }
    }

    if (nearest_i !== null) {
        return colliders[nearest_i];
    }
}

function inside(origin: Vec3, aabb: Collide) {
    return (
        origin[0] >= aabb.Min[0] &&
        origin[0] <= aabb.Max[0] &&
        origin[1] >= aabb.Min[1] &&
        origin[1] <= aabb.Max[1] &&
        origin[2] >= aabb.Min[2] &&
        origin[2] <= aabb.Max[2]
    );
}

function distance(origin: Vec3, direction: Vec3, aabb: Collide) {
    let max_lo = -Infinity;
    let min_hi = +Infinity;

    for (let i = 0; i < 3; i++) {
        let lo = (aabb.Min[i] - origin[i]) / direction[i];
        let hi = (aabb.Max[i] - origin[i]) / direction[i];

        if (lo > hi) {
            [lo, hi] = [hi, lo];
        }

        if (hi < max_lo || lo > min_hi) {
            return Infinity;
        }

        if (lo > max_lo) max_lo = lo;
        if (hi < min_hi) min_hi = hi;
    }

    return max_lo > min_hi ? Infinity : max_lo;
}
