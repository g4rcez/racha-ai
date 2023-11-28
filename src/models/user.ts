import { uuid } from "~/lib/fn";
import { Entity } from "~/models/entity";

export class User implements Entity {
    public name: string;
    public readonly id: string;
    public readonly createdAt: Date;

    public constructor(user?: User) {
        this.name = user?.name ?? "";
        this.id = user?.id ?? uuid();
        this.createdAt = user?.createdAt ?? new Date();
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
