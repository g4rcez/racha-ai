import { uuidv7 } from "@kripod/uuidv7";
import * as process from "process";
import { db } from "~/db";
import { DB } from "~/db/types";
import { users } from "~/db/users";
import { Division } from "~/models/entity-types";
import { OrdersService } from "~/services/orders/orders.service";
import { OrdersMapper } from "~/services/orders/orders.mapper";

async function insertUsers() {
  const listOfUsers: DB.User[] = [
    {
      id: "018de2eb-f922-77e6-b282-0ffc93695a7b",
      name: "John Doe",
      password: "",
      secretId: "",
      email: "johndoe@gmail.com",
      createdAt: new Date(),
      image: "https://avatars.githubusercontent.com/u/583231?v=4",
      preferences: {},
    },
    {
      id: "018de2ed-ce07-7cd2-80b9-dd5710f95abf",
      name: "Fulano",
      email: "fulano@gmail.com",
      password: "",
      secretId: "",
      createdAt: new Date(),
      image: "https://avatars.githubusercontent.com/u/583231?v=4",
      preferences: {},
    },
  ];
  try {
    await Promise.all(
      listOfUsers.map((user) => db.insert(users).values(user).execute()),
    );
    return listOfUsers;
  } catch (error) {
    return listOfUsers;
  }
}

async function seed() {
  const listOfUsers = await insertUsers();
  const me = listOfUsers[0]!;
  const other = listOfUsers[1]!;
  const result = OrdersMapper.toDb({
    me,
    products: [
      {
        id: uuidv7(),
        quantity: 2,
        price: 10,
        name: "Product",
        createdAt: new Date(),
        consumers: [
          { ...me, name: me.name!, amount: 10, quantity: 1 },
          { ...other, name: me.name!, amount: 10, quantity: 1 },
        ],
        division: Division.PerConsume,
        monetary: "R$ 20,00",
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
    users: listOfUsers,
    metadata: {},
    id: uuidv7(),
  });
  await OrdersService.create(result);
}

seed().then(() => {
  console.log("success");
  process.exit(0);
});
