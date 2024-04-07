export const Links = {
  app: "/app",
  cart: "/app/cart",
  friends: "/app/friends",
  login: "/login",
  newOrder: `/app/orders/new`,
  order: `/app/orders`,
  orderId: <ID extends string>(id: ID) => `/app/orders/${id}` as const,
  orderProduct: `/app/orders/new/product`,
  profile: "/app/profile",
  userGroupId: <ID extends string>(id: ID) =>
    `/app/social/groups/${id}` as const,
} as const;
