import { Entity } from "~/models/entity";

export class Cart extends Entity {
    public name: string;

    public constructor(cart?: Cart) {
        super(cart);
        this.name = cart?.name ?? "";
    }

    public clone() {
        return new Cart(this);
    }
}
