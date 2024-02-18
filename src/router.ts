export const Links = {
  app: "/app",
  cart: "/app/cart",
  profile: "/app/profile",
  cartId: <ID extends string>(id: ID) => `/app/cart/${id}` as const,
  friends: "/app/friends",
  login: "/login",
  userGroupId: <ID extends string>(id: ID) =>
    `/app/social/groups/${id}` as const,
} as const;
