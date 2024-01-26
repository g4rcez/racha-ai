export const Links = {
  app: "/app",
  cartId: (id: string) => `/app/cart/${id}` as const,
} as const;
