import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { User } from "~/models/user";
import {DeepPartial} from "~/types";

export class Cart extends Entity {
    public name: string;
    public users: User[];
    public products: Product[];

    public constructor(cart?: DeepPartial<Cart>) {
        super(cart);
        this.name = cart?.name ?? "";
        this.users = cart?.users ?? [];
        this.products = cart?.products ?? [];
    }

    public clone() {
        return new Cart(this);
    }

    public updateProduct(product: Product) {
        this.products = this.products.map((x) => (x.id === product.id ? product : x));
    }

    public updateUser(user: User) {
        this.users = this.users.map((x) => (x.id === user.id ? user : x));
    }

    public newProduct() {
        this.products.push(new Product());
    }

    public newUser() {
        this.users.push(new User());
    }
}
