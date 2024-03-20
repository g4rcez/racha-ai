export class Dict<K, V> extends Map<K, V> {
  public static from<
    Item,
    K extends keyof Item,
    Fn extends ((item: Item) => any) | undefined,
  >(key: K, list: Item[], fn?: Fn) {
    return new Dict<
      Item[K],
      Fn extends undefined ? Item : ReturnType<NonNullable<Fn>>
    >(list.map((x) => [x[key], fn ? fn(x) : x]));
  }

  public static toArray<K, V>(dict: Dict<K, V>) {
    return Array.from(dict.values());
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

  public static groupBy<T, K extends keyof T>(key: K, array: T[]) {
    const dict = new Dict<T[K], T[]>();
    array.forEach((item) => {
      const id = item[key];
      const group = dict.get(id) || [];
      dict.set(id, [...group, item]);
    });
    return dict;
  }
}
