import { createGlobalReducer } from "use-typed-reducer";
import { z } from "zod";
import { User } from "~/models/user";
import { createStorageMiddleware } from "~/store/middleware";

const schemas = {
    v1: z
        .object({ users: z.array(User.schema) })
        .transform((list) => ({ users: list.users.map((x) => new User(x as never as User)) }))
        .default({ users: [] })
};

type Versions = keyof typeof schemas;

const currentVersion: Versions = "v1";

const currentSchema = schemas[currentVersion];

type State = z.infer<typeof currentSchema>;

const storage = createStorageMiddleware("friends", schemas, "v1");

const state: State = storage.get();

export const useFriends = createGlobalReducer(
    state,
    (get) => ({
        upsert: (user: User) => {
            const list = get.state().users;
            if (list.length === 0) return { users: [user] };
            const index = list.findIndex((x) => x.id === user.id);
            if (index === -1) return { users: list.concat(user) };
            list[index].name = user.name;
            return { users: Array.from(list) };
        },
        new: (user: User) => ({ users: [...get.state().users, user] }),
        update: (user: User) => ({ users: get.state().users.map((x) => (x.id === user.id ? user.clone() : x)) }),
        delete: (user: User) => ({ users: get.state().users.filter((x) => x.id !== user.id) })
    }),
    undefined,
    [storage.middleware]
);
