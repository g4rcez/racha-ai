import { LocalStorage } from "storage-manager-js";
import { ObjectSchema, safeParse } from "valibot";
import { createGlobalReducer, ReducerActions } from "~/use-typed-reducer";

export namespace Entity {
    type Metadata = { id: string; createdAt: Date };
    export const validator =
        (validator: ObjectSchema<any>) =>
        <State>(data: any, defaultData: (storage: any) => State): State => {
            const result = safeParse(validator, data);
            console.log(result);
            return result.success ? (result.output as State) : defaultData(data);
        };

    type ValidatorsSchema = {
        [K in `v${number}`]: ReturnType<typeof validator>;
    };

    export const create = <
        const Info extends { name: string; schemas: ValidatorsSchema; version: keyof Info["schemas"] },
        Getter extends (storage?: any) => any,
        Reducer extends ReducerActions<ReturnType<Getter>, {}>,
        Actions extends { [k in string]: (...a: any[]) => any }
    >(
        info: Info,
        getState: Getter,
        reducer: Reducer,
        actions: Actions
    ) => {
        type State = ReturnType<Getter>;
        const schema = info.schemas[info.version as any] as ReturnType<typeof validator>;
        const storageKey = `@app/${info.name}`;
        const getInitialState = (): State => {
            const storageData = LocalStorage.get(storageKey);
            return schema<State>(storageData, getState) as State;
        };
        const middleware = [
            (state: State) => {
                LocalStorage.set(storageKey, state);
                return state;
            }
        ];
        const useStore = createGlobalReducer(getInitialState(), reducer, undefined, middleware);
        const use = () => useStore();

        type FullState = State & Metadata;

        return {
            ...actions,
            use,
            action: useStore.dispatchers,
            __state: undefined as unknown as FullState,
            initialState: getInitialState
        };
    };

    export type infer<T extends ReturnType<typeof create>> = {
        state: T["__state"];
    };
}
