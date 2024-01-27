import { describe, expect, it } from "vitest";
import { Dict } from "../src/lib/dict";

const test = it.concurrent;
describe("Should test Dict class", () => {
  test("Should initialize with array of arrays", () => {
    const dict = new Dict([[1, 1]]);
    expect(dict.size).toBe(1);
    expect(dict.get(1)).toBe(1);
  });

  test("Should initialize with Dict", () => {
    const dict = new Dict([[1, 1]]);
    const other = new Dict(dict);
    expect(other.size).toBe(1);
    expect(other.get(1)).toBe(1);
    expect(dict === other).toBe(false);
  });

  test("Should get a new instance", () => {
    const dict = new Dict([[1, 1]]);
    expect(dict === dict.clone()).toBe(false);
  });

  test("Should remove item", () => {
    const dict = new Dict([[1, 1]]);
    const same = dict.remove(1);
    expect(dict === same).toBe(true);
    expect(same.size).toBe(0);
  });
});
