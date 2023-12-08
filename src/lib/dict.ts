export class Dict<K, V> extends Map<K, V> {
    public map<Fn extends (value: V, key: K, index: number) => any>(fn: Fn) {
        const entries = this.entries();
        return Array.from(entries).map(([k, v], i)=> fn(v, k, i))
    }

    public toJSON() {
        return Array.from(this.values());
    }

    public remove(id: K) {
        this.delete(id);
        return this;
    }
}
