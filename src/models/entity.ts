import { LocalStorage } from "storage-manager-js";
import { ObjectSchema, safeParse } from "valibot";
import { createGlobalReducer, ReducerActions } from "~/use-typed-reducer";

export namespace Entity {
    type Metadata = { id: string; createdAt: Date };

    export type New<T extends object> = T & Metadata;

    export const validator =
        (validator: ObjectSchema<any>) =>
        <State>(data: any, defaultData: (storage: any) => State): State => {
            const result = safeParse(validator, data);
            return result.success ? defaultData(result.output as State) : defaultData(data);
        };

    type ValidatorsSchema = {
        [K in `v${number}`]: ReturnType<typeof validator>;
    };

    type Middleware<T> = (state: T) => T;

    export const createStorageMiddleware = <State>(key: string): Middleware<State>[] => [
        (state: State) => {
            LocalStorage.set(key, state);
            return state;
        }
    ];

    export const create = <
        const Info extends { name: string; schemas: ValidatorsSchema; version: keyof Info["schemas"] },
        Getter extends (storage?: any) => any,
        Reducer extends ReducerActions<ReturnType<Getter>, {}>,
        Actions extends { [k in string]: any }
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
        const setStore = (state: State) => LocalStorage.set(storageKey, state);

        const middleware = createStorageMiddleware<State>(storageKey);

        const useStore = createGlobalReducer(getInitialState(), reducer, undefined, middleware);
        const use = <Selector extends (s: State) => any>(selector?: Selector) => useStore(selector);
        const setup = () => {
            const storageData = LocalStorage.get(storageKey);
            return storageData ? setStore(getState(storageData)) : setStore(getState());
        };
        type FullState = State & Metadata;
        setup();
        return {
            ...actions,
            use,
            getState,
            clearStorage: () => LocalStorage.delete(storageKey),
            action: useStore.dispatchers,
            __state: undefined as unknown as FullState,
            initialState: getInitialState
        };
    };

    export type infer<T extends ReturnType<typeof create>> = {
        state: T["__state"];
    };
}
