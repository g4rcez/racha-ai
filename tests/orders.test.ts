import { uuidv7 } from "@kripod/uuidv7";
import { describe, expect, test } from "vitest";
import { Division } from "../src/models/entity-types";
import { OrdersMapper } from "../src/services/orders/orders.mapper";

describe("Should test orders mapping", () => {
  test("Should test simple orders", () => {
    const me = { id: uuidv7(), name: "Me", createdAt: new Date() };
    const result = OrdersMapper.toDb({
      me,
      products: [
        {
          id: uuidv7(),
          quantity: 1,
          price: 1,
          name: "Product",
          createdAt: new Date(),
          consumers: [{ ...me, amount: 1, quantity: 1 }],
          division: Division.PerConsume,
          monetary: "R$ 10,00",
        },
      ],
      couvert: "R$ 10,00",
      hasCouvert: true,
      category: "food",
      type: "restaurant",
      createdAt: new Date(),
      currencyCode: "BRL",
      additional: "10,00%",
      currentProduct: null,
      finishedAt: null,
      groupId: "",
      hasAdditional: true,
      justMe: false,
      title: "Bar de teste",
      users: [me],
      metadata: {},
      id: uuidv7(),
    });
    const order = result.order;
    expect(order.total).toBe("11.1");
  });

  test("Should test split product", () => {
    const me = { id: uuidv7(), name: "Me", createdAt: new Date() };
    const otherUser = { id: uuidv7(), name: "Other", createdAt: new Date() };
    const result = OrdersMapper.toDb({
      me,
      products: [
        {
          id: uuidv7(),
          quantity: 1,
          price: 1,
          name: "Product",
          createdAt: new Date(),
          consumers: [
            { ...me, amount: 0.5, quantity: 0.5 },
            { ...otherUser, amount: 0.5, quantity: 0.5 },
          ],
          division: Division.PerConsume,
          monetary: "R$ 10,00",
        },
      ],
      couvert: "R$ 10,00",
      hasCouvert: true,
      category: "food",
      type: "restaurant",
      createdAt: new Date(),
      currencyCode: "BRL",
      additional: "10,00%",
      currentProduct: null,
      finishedAt: null,
      groupId: "",
      hasAdditional: true,
      justMe: false,
      title: "Bar de teste",
      users: [me, otherUser],
      metadata: {},
      id: uuidv7(),
    });
    const order = result.order;
    expect(order.total).toBe("21.1");
  });

  test("Should test with more products", () => {
    const me = { id: uuidv7(), name: "Me", createdAt: new Date() };
    const otherUser = { id: uuidv7(), name: "Other", createdAt: new Date() };
    const result = OrdersMapper.toDb({
      me,
      products: [
        {
          id: uuidv7(),
          quantity: 10,
          price: 5,
          name: "Latão",
          createdAt: new Date(),
          consumers: [
            { ...me, amount: 25, quantity: 7 },
            { ...otherUser, amount: 25, quantity: 3 },
          ],
          division: Division.PerConsume,
          monetary: "R$ 5,00",
        },
        {
          id: uuidv7(),
          quantity: 2,
          price: 2,
          name: "Product",
          createdAt: new Date(),
          consumers: [
            { ...me, amount: 2, quantity: 1 },
            { ...otherUser, amount: 2, quantity: 1 },
          ],
          division: Division.PerConsume,
          monetary: "R$ 2,00",
        },
      ],
      couvert: "R$ 5,00",
      hasCouvert: true,
      category: "food",
      type: "restaurant",
      createdAt: new Date(),
      currencyCode: "BRL",
      additional: "10,00%",
      currentProduct: null,
      finishedAt: null,
      groupId: "",
      hasAdditional: true,
      justMe: false,
      title: "Bar de teste",
      users: [me, otherUser],
      metadata: {},
      id: uuidv7(),
    });
    const order = result.order;
    expect(order.total).toBe("69.4");
    expect(result.payments[0].amount).toBe("45.7");
    expect(result.payments[1].amount).toBe("23.700000000000003");
    expect((order.metadata as any).consumers).toBe(2);
  });
});
