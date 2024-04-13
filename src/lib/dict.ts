import { Is } from "~/lib/is";

export class Dict<K, V> extends Map<K, V> {
    public static from<Item, K extends keyof Item | ((k: Item) => string), Fn extends ((item: Item) => any) | undefined>(key: K, list: Item[], fn?: Fn) {
        const get = Is.function(key) ? key : (item: Item) => (item as any)[key];
        return new Dict<K extends keyof Item ? Item[K] : string, Fn extends undefined ? Item : ReturnType<NonNullable<Fn>>>(list.map((x) => [get(x), fn ? fn(x) : x]));
    }

    public static toArray<K, V>(dict: Dict<K, V>) {
        return Array.from(dict.values());
    }

    public static group<T, K extends keyof T | ((k: T) => string)>(key: K, array: T[]): Dict<K extends keyof T ? T[K] : string, T[]> {
        const dict = new Dict();
        const get = Is.function(key) ? key : (item: T) => (item as any)[key];
        array.forEach((item) => {
            const id: any = get(item);
            const group: any = dict.get(id) || [];
            dict.set(id, [...group, item]);
        });
        return dict as any;
    }

    public toArray() {
        return Dict.toArray(this);
    }

    public arrayMap<Fn extends (value: V, key: K, index: number) => any>(fn: Fn) {
        const entries = this.entries();
        return Array.from(entries).map(([k, v], i) => fn(v, k, i));
    }

    public map<Fn extends (value: V, key: K) => [K, V]>(fn: Fn) {
        const a: Array<[K, V]> = [];
        this.forEach((value, key) => a.push(fn(value, key)));
        return new Dict(a);
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
