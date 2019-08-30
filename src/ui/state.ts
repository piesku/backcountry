import {Action} from "../actions.js";

export interface UIState {
    world: string;
    seed_player: number;
    seed_town: number;
}

export const INIT_UI_STATE: UIState = {
    world: "intro",
    seed_player: 102,
    seed_town: 103,
};

export function reducer(state: UIState, action: Action, args: Array<unknown>): UIState {
    switch (action) {
        case Action.ChangeWorld:
            return {
                ...state,
                world: args[0] as string,
            };
        default:
            return state;
    }
}
