import { EffectCallback, useEffect } from "react";
import { LocalStorage } from "storage-manager-js";
import {
  createGlobalReducer,
  createLocalStoragePlugin,
  createLoggerPlugin,
  ReducerActions,
} from "use-typed-reducer";
import { z } from "zod";
import { isServerSide } from "~/lib/fn";
import { Is } from "sidekicker";
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
    <State>(
      data: any,
      defaultData: (storage: any) => State,
      name: string,
    ): State => {
      const result = validator.safeParse(data);
      if (!result.success)
        console.log(name, validator, data, result.error.issues);
      return result.success
        ? defaultData(result.data as State)
        : defaultData(data);
    };

  type ValidatorsSchema = {
    [K in `v${number}`]: ReturnType<typeof validator>;
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

    const schema = info.schemas[info.version as any] as ReturnType<
      typeof validator
    >;

    const storageKey = `@app/${info.name}@${info.version as string}`;

    const getInitialState = (): State => {
      if (isServerSide()) return getState();
      const storageData = LocalStorage.get(storageKey);
      return schema<State>(storageData, getState, storageKey) as State;
    };

    const setStore = (state: State) => {
      if (isServerSide()) return;
      LocalStorage.set(storageKey, state);
    };

    const useStore = createGlobalReducer(getInitialState(), reducer, {
      interceptor: [
        createLocalStoragePlugin(storageKey),
        createLoggerPlugin(storageKey),
      ],
    });

    const use = <Selector extends (s: State) => any>(
      selector?: Selector,
      effect?: EffectCallback,
    ) => {
      useEffect(() => {
        if (effect) return effect();
      }, []);
      return useStore(selector);
    };

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
      action: useStore.dispatchers,
      clearStorage: () => LocalStorage.delete(storageKey),
      getCurrentState: (): State => getState(LocalStorage.get(storageKey)),
      getState,
      initialState: getInitialState,
      use,
    } as const;
  };
}
