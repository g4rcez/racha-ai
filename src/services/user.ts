import { or, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { DB } from "~/db/types";
import { users, usersFriends } from "~/db/users";
import { Either } from "~/lib/either";

export namespace User {
  const mapUser = (user: DB.User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  });

  export type MappedUser = ReturnType<typeof mapUser>;

  export const getFriends = Either.transform(async (id: string) => {
    const query = db
      .select()
      .from(users)
      .innerJoin(usersFriends, eq(users.id, usersFriends.ownerId))
      .where(or(eq(usersFriends.ownerId, id), eq(usersFriends.invitedId, id)));
    const result = await query.execute();
    return result.map((x) => x.usersFriends);
  });

  export const getByEmail = Either.transform(async (email: string) => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    return result[0] || null;
  });

  export const newUserGroup = z.object({
    owner: z.string().uuid(),
    email: z.string().email(),
    groupId: z.string().uuid(),
  });

  export const deleteUserGroup = z.object({
    userId: z.string().uuid(),
    groupId: z.string().uuid(),
    ownerId: z.string().uuid(),
  });
}
