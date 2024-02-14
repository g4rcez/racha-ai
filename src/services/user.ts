import { uuidv7 } from "@kripod/uuidv7";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { Groups, groups, users } from "~/db/users";
import { Either } from "~/lib/either";

export namespace User {
  export const getFriends = Either.transform(async (id: string) => {
    const result = await db
      .select()
      .from(users)
      .innerJoin(groups, eq(users.id, groups.ownerId))
      .where(eq(groups.ownerId, id))
      .execute();
    return result.map((x) => x.groups);
  });

  export const groupSchema = z.object({
    title: z.string().min(1).max(256),
    avatar: z.string().url(),
    description: z.string().min(1).max(256),
  });

  export type GroupSchema = z.infer<typeof groupSchema>;

  export const createGroup = Either.transform(
    async (group: GroupSchema, userId: string): Promise<Groups> => {
      const now = new Date();
      const id = uuidv7();
      const createdGroup: Groups = {
        id,
        createdAt: now,
        deletedAt: null,
        ownerId: userId,
        title: group.title,
        avatar: group.avatar,
        description: group.description,
      };
      await db.insert(groups).values(createdGroup);
      return createdGroup;
    },
  );
}
