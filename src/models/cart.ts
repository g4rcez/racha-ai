import { Entity } from "~/models/entity";

export class Cart implements Entity {
    public name: string;

    public constructor(cart?: Cart) {
        this.name = cart?.name ?? "";
    }

    public clone() {
        return new Cart(this);
    }
}
