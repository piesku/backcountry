import { Action } from "../actions.js";

export interface UIState {
    world: string;
}

export const INIT_UI_STATE: UIState = {
    // world: "intro",
    world: "map",
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
