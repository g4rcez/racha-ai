class User {
    public readonly name: string;
    public id: string;

    public constructor(user?: User) {
        this.name = user?.name ?? "";
        this.id = user?.id ?? "";
    }

    public clone() {
        return new User(this);
    }
}
