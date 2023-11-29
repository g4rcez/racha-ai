import { Entity } from "~/models/entity";
import { DeepPartial } from "~/types";

export class User extends Entity {
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
