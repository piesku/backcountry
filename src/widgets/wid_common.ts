import {Entity, Game} from "../game";

export type Widget = (game: Game, entity: Entity) => void;
