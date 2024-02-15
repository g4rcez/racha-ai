import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { createGlobalReducer, ReducerActions } from "use-typed-reducer";
import { Env } from "~/lib/env";
import { isServerSide } from "~/lib/fn";
import { Is } from "~/lib/is";
import { FN } from "~/types";

export namespace Store {
  type Metadata = { id: string; createdAt: Date };

  export const date = z
    .string()
    .datetime()
    .or(z.date())
    .transform((x) => (x ? new Date(x) : null));

  export const schema = z.object({
    id: z.string().uuid(),
    createdAt: date,
  });

  export type New<T extends object> = T & Metadata;

  export const validator =
    (validator: z.ZodType) =>
    <State>(data: any, defaultData: (storage: any) => State): State => {
      const result = validator.safeParse(data);
      return result.success
        ? defaultData(result.data as State)
        : defaultData(data);
    };

  type ValidatorsSchema = {
    [K in `v${number}`]: ReturnType<typeof validator>;
  };

  type Middleware<T> = (state: T, method: string, prev: T) => T;

  export const createStorageMiddleware = <State>(
    key: string,
  ): Middleware<State>[] => {
    const middle: Middleware<State>[] = [
      (state: State) => {
        LocalStorage.set(key, state);
        return state;
      },
    ];
    if (Env.isLocal) {
      middle.push((state: State, method: string, prev: State) => {
        console.group(key);
        console.info("Update by", method);
        console.info("Previous state", prev);
        console.info(state);
        console.groupEnd();
        return state;
      });
    }
    return middle;
  };

  export const create = <
    const Info extends {
      name: string;
      schemas: ValidatorsSchema;
      version: keyof Info["schemas"];
    },
    Getter extends (storage?: any) => any,
    Reducer extends ReducerActions<ReturnType<Getter>, {}>,
    Actions extends
      | { [k in string]: any }
      | ((args: { storageKey: string; getState: () => ReturnType<Getter> }) => {
          [k in string]: any;
        }),
  >(
    info: Info,
    getState: Getter,
    reducer: Reducer,
    actions: Actions,
  ) => {
    type State = ReturnType<Getter>;
    type FullState = State & Metadata;

    const schema = info.schemas[info.version as any] as ReturnType<
      typeof validator
    >;

    const storageKey = `@app/${info.name}@${info.version as string}`;

    const getInitialState = (): State => {
      if (isServerSide()) return getState();
      const storageData = LocalStorage.get(storageKey);
      return schema<State>(storageData, getState) as State;
    };

    const setStore = (state: State) => {
      if (isServerSide()) return;
      LocalStorage.set(storageKey, state);
    };

    const middleware = createStorageMiddleware<State>(storageKey);

    const useStore = createGlobalReducer(
      getInitialState(),
      reducer,
      undefined,
      middleware,
    );
    const use = <Selector extends (s: State) => any>(selector?: Selector) =>
      useStore(selector);

    const setup = () =>
      setStore(
        getState(isServerSide() ? undefined : LocalStorage.get(storageKey)),
      );

    const act: Actions extends FN ? ReturnType<Actions> : Actions = Is.function(
      actions,
    )
      ? actions({ storageKey, getState: getInitialState })
      : actions;

    setup();

    return {
      ...act,
      use,
      getState,
      clearStorage: () => LocalStorage.delete(storageKey),
      action: useStore.dispatchers,
      __state: undefined as unknown as FullState,
      initialState: getInitialState,
    } as const;
  };
}
