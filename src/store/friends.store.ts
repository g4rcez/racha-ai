import { uuidv7 } from "@kripod/uuidv7";
import { z } from "zod";
import { Dict } from "~/lib/dict";
import { Store } from "~/models/store";
import { ParseToRaw } from "~/types";

const user = z.object({
  name: z.string(),
  id: z.string().uuid(),
  createdAt: z.date().or(z.string().datetime()),
});

const schemas = {
  v1: Store.validator(
    z.object({
      users: z.array(user),
    }),
  ),
};

export type User = { id: string; name: string; createdAt: Date };

type State = { users: Dict<string, User> };

const order = <T extends { name: string; id: string }>(users: T[]): T[] =>
  users.toSorted((a, b) =>
    a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1,
  );

export const Friends = Store.create(
  { name: "friends", schemas, version: "v1" },
  (store?: ParseToRaw<State>) =>
    ({ users: Dict.from("id", store?.users ?? []) }) as State,
  (get) => ({
    delete: (user: User) => ({ users: get.state().users.remove(user.id) }),
    upsert: (user: User) => ({
      users: get.state().users.clone().set(user.id, user),
    }),
  }),
  {
    order,
    schema: user,
    getUserById: (id: string) => Friends.getCurrentState().users.get(id),
    hasUser: (userId: string, users: User[]) =>
      users.some((x) => x.name === userId),
    new: (name: string = ""): User => ({
      id: uuidv7(),
      createdAt: new Date(),
      name,
    }),
  },
);
