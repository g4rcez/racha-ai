import { createGlobalReducer } from "use-typed-reducer";
import { Cart } from "~/models/cart";

export const useGlobalStore = createGlobalReducer(new Cart(), (get) => ({
    name: (name: string) => {
        const state = get.state();
        state.name = name;
        return state.clone();
    }
}));
