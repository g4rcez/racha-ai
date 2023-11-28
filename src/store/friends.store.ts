import { createGlobalReducer } from "use-typed-reducer";
import { z } from "zod";
import { parseFromSchema } from "~/lib/fn";
import { User } from "~/models/user";
import { createStorageMiddleware } from "~/store/middleware";

const schemas = {
    v1: z
        .object({
            users: z.array(
                z.object({
                    id: z.string().uuid(),
                    name: z.string().min(1),
                    createdAt: z.string().datetime()
                })
            )
        })
        .transform((state) => ({ users: state.users.map((x) => new User(x as never as User)) }))
        .default({ users: [] })
};

type Versions = keyof typeof schemas;

const versions = {
    v1: (a: any) => parseFromSchema(a, schemas.v1)
} satisfies Record<Versions, (a: any) => State>;

const currentVersion: Versions = "v1";

const currentSchema = schemas[currentVersion];

type State = z.infer<typeof currentSchema>;

const storage = createStorageMiddleware("friends", currentVersion, versions);

const state: State = storage.get();

export const useFriends = createGlobalReducer(
    state,
    (get) => ({
        new: (user: User) => ({ users: [...get.state().users, user] }),
        update: (user: User) => ({ users: get.state().users.map((x) => (x.id === user.id ? user.clone() : x)) }),
        delete: (user: User) => ({ users: get.state().users.filter((x) => x.id !== user.id) })
    }),
    undefined,
    [storage.middleware]
);
