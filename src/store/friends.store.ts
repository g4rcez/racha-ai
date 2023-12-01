import { uuidv7 } from "@kripod/uuidv7";
import { array, coerce, date, object, string, union, uuid } from "valibot";
import { Entity } from "~/models/entity";

const dateCoerce = coerce(date(), (i) => new Date(i as any));

const user = object({
    name: string(),
    id: string([uuid()]),
    createdAt: union([date(), dateCoerce])
});

const schemas = {
    v1: Entity.validator(object({ users: array(user) }))
};

export type User = { id: string; name: string; createdAt: Date };

type State = { users: User[] };

export const Friends = Entity.create(
    { name: "friends", schemas, version: "v1" },
    () => ({ users: [] }) as State,
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
        update: (user: User) => ({ users: get.state().users.map((x) => (x.id === user.id ? user : x)) }),
        delete: (user: User) => ({ users: get.state().users.filter((x) => x.id !== user.id) })
    }),
    {
        new: (name: string = ""): User => ({ id: uuidv7(), createdAt: new Date(), name }),
        hasUser: (user: string, users: User[]) => users.some((x) => x.name === user)
    }
);
