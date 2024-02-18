export const Endpoints = {
  createGroup: "/api/users/groups",
  addMember: (id: string) => `/api/users/groups/${id}`,
};
