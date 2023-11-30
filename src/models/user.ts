import { z } from "zod";
import { Entity } from "~/models/entity";
import { DeepPartial } from "~/types";

export class User extends Entity {
    public static schema = z
        .object({
            ...Entity._schema,
            name: z.string().default("")
        })
        .transform((user) => new User(user as any));
    public name: string;

    public constructor(user?: DeepPartial<User>) {
        super(user);
        this.name = user?.name ?? "";
    }

    public static new(name: string) {
        const user = new User();
        user.name = name;
        return user;
    }

    public static hasUser(name: string, users: User[]) {
        return users.some((x) => name === x.name);
    }

    public clone() {
        return new User(this);
    }
}
