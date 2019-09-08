import {Entity, Game} from "../game";

export type Widget = (
    game: Game,
    entity: Entity,
    x: number,
    y: number,
    args: Array<unknown>
) => void;
