export class Dict<K, V> extends Map<K, V> {
    public static from<Item, K extends keyof Item, Fn extends (item: Item) => any>(
        key: K,
        list: Item[],
        fn?: (item: Item) => any,
    ) {
        return new Dict<Item[K], ReturnType<Fn>>(list.map((x) => [x[key], fn ? fn(x) : x]));
    }

    public static toArray<K, V>(dict: Dict<K, V>) {
        return Array.from(dict.values());
    }

    public toArray() {
        return Dict.toArray(this);
    }

    public map<Fn extends (value: V, key: K, index: number) => any>(fn: Fn) {
        const entries = this.entries();
        return Array.from(entries).map(([k, v], i) => fn(v, k, i));
    }

    public toJSON() {
        return Array.from(this.values());
    }

    public remove(id: K) {
        this.delete(id);
        return this;
    }

    public clone() {
        return new Dict(this);
    }
}
