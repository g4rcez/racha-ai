export class Dict<K, V> extends Map<K, V> {
    public map<Fn extends (value: V, key: K, index: number) => any>(fn: Fn) {
        const array: ReturnType<Fn>[] = [];
        let i = 0;
        this.forEach((value, key) => {
            array.push(fn(value, key, i));
            i += 1;
        });
        return array;
    }

    public toJSON() {
        return Array.from(this.values());
    }

    public remove(id: K) {
        this.delete(id);
        return this;
    }
}
