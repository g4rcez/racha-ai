import { uuidv7 } from "@kripod/uuidv7";
import { and, eq, isNull } from "drizzle-orm";
import { createLogger } from "vite";
import { z } from "zod";
import { db } from "~/db";
import { DB } from "~/db/types";
import { Groups, Users, groups, userGroups, users } from "~/db/users";
import { Either } from "~/lib/either";
import { Nullable, ParseToRaw } from "~/types";

export namespace User {
  const mapUser = (user: Users) => ({
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
      .innerJoin(groups, eq(users.id, groups.ownerId))
      .where(and(eq(groups.ownerId, id), isNull(groups.deletedAt)));
    const result = await query.execute();
    return result.map((x) => x.groups);
  });

  export const getByEmail = Either.transform(async (email: string) => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    return result[0] || null;
  });

  export const getGroupById = Either.transform(
    async (
      userId: string,
      groupId: string,
    ): Promise<Nullable<ParseToRaw<Groups> & { users: MappedUser[] }>> => {
      const query = db
        .select()
        .from(groups)
        .innerJoin(userGroups, eq(userGroups.groupId, groups.id))
        .innerJoin(users, eq(users.id, userGroups.userId))
        .where(and(eq(groups.id, groupId), isNull(userGroups.deletedAt)));
      const result = await query.execute();
      if (result.length === 0) return null;
      const hasCurrentUser = result.some((x) => x.user.id === userId);
      if (!hasCurrentUser) return null;
      const group = result[0]!.groups;
      return {
        ...group,
        createdAt: group.createdAt.toISOString(),
        users: result.map((y) => mapUser(y.user)),
        deletedAt: group.deletedAt ? group.deletedAt.toISOString() : null,
      };
    },
  );

  export const groupSchema = z.object({
    title: z.string().min(1).max(256),
    avatar: z.string().url(),
    description: z.string().min(1).max(256),
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

  export type GroupSchema = z.infer<typeof groupSchema>;

  const addToGroup = async (query: DB.Query, userId: string, groupId: string) =>
    query.insert(userGroups).values({
      userId,
      groupId,
      id: uuidv7(),
    });

  export const addUserToGroup = Either.transform(
    (userId: string, groupId: string) => addToGroup(db, userId, groupId),
  );

  export const createGroup = Either.transform(
    async (group: GroupSchema, userId: string): Promise<Groups> => {
      return db.transaction(async (transaction) => {
        try {
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
          await transaction.insert(groups).values(createdGroup);
          await addToGroup(transaction, userId, id);
          return createdGroup;
        } catch (e) {
          console.log(e);
          transaction.rollback();
          throw e;
        }
      });
    },
  );

  export const isGroupOwner = Either.transform(
    async (ownerId: string, groupId: string) => {
      const result = await db
        .select()
        .from(groups)
        .where(and(eq(groups.ownerId, ownerId), eq(groups.id, groupId)))
        .execute();
      return result.length === 1;
    },
  );

  export const removeFromGroup = Either.transform(
    async (userToRemove: string, groupId: string) => {
      await db
        .update(userGroups)
        .set({
          deletedAt: new Date(),
        })
        .where(
          and(
            eq(userGroups.groupId, groupId),
            eq(userGroups.userId, userToRemove),
          ),
        )
        .execute();
    },
  );

  export const deleteGroup = Either.transform(async (id: string) => {
    const query = db
      .update(userGroups)
      .set({ deletedAt: new Date() })
      .where(eq(groups.id, id));
    console.log(query.toSQL());
    return query.execute();
  });
}
