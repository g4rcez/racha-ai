import { describe, expect, it } from "vitest";
import { fromStrNumber, toFraction } from "../src/lib/fn";

const test = it.concurrent;

describe("Should tests formatters", () => {
  test("Should test fraction formatter", () => {
    expect(toFraction(1 / 3)).toBe("1/3");
    expect(toFraction(7 / 3)).toBe("2 + 1/3");
    expect(toFraction(3 / 3)).toBe("1");
  });

  test("Should test fromStringToNumber", () => {
    expect(fromStrNumber("R$ 10,00")).toBe(10);
    expect(fromStrNumber("100%")).toBe(100);
    expect(fromStrNumber("R$ 10,50")).toBe(10.5);
    expect(fromStrNumber("R$ 10,99")).toBe(10.99);
    expect(fromStrNumber("R$ 10.99")).toBe(10.99);
  });
});
