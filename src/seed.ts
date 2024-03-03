import { uuidv7 } from "@kripod/uuidv7";
import * as process from "process";
import { db } from "~/db";
import { DB } from "~/db/types";
import { users } from "~/db/users";
import { Division } from "~/models/entity-types";
import { OrdersService } from "~/services/orders/orders.service";
import { OrdersMapper } from "~/services/orders/orders.mapper";
import { User } from "~/services/user";

async function insertUsers() {
  const listOfUsers: DB.User[] = [
    {
      id: "018de2eb-f922-77e6-b282-0ffc93695a7b",
      name: "John Doe",
      email: "johndoe@gmail.com",
      createdAt: new Date(),
      image: "https://avatars.githubusercontent.com/u/583231?v=4",
      preferences: {},
      emailVerified: null,
    },
    {
      id: "018de2ed-ce07-7cd2-80b9-dd5710f95abf",
      name: "Fulano",
      email: "fulano@gmail.com",
      createdAt: new Date(),
      image: "https://avatars.githubusercontent.com/u/583231?v=4",
      preferences: {},
      emailVerified: null,
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

const insertGroup = async (listOfUsers: DB.User[]) => {
  try {
    return await User.createGroup(
      {
        avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
        title: "Group",
        description: "Seed group",
      },
      listOfUsers[0].id,
    );
  } catch (e) {
    return {
      id: uuidv7(),
      createdAt: new Date(),
      deletedAt: null,
      title: "GROUP WITH ERROR",
      ownerId: listOfUsers[0].id,
      description: "GROUP WITH Error",
      avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
    };
  }
};

async function seed() {
  const listOfUsers = await insertUsers();
  await insertGroup(listOfUsers);
  // group
  // orders
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
