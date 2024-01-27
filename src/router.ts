export const Links = {
  app: "/app",
  cart: "/app/cart",
  profile: "/app/profile",
  cartId: <ID extends string>(id: ID): `/app/cart/${ID}` => `/app/cart/${id}`,
  friends: "/app/friends",
} as const;
