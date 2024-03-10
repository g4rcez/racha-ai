import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { Groups } from "~/db/users";
import { safeJson } from "~/lib/fn";
import { User } from "~/services/user";
import { ParseToRaw } from "~/types";

export namespace GroupsService {
  const serverSideProps = (groups?: Groups[]) => ({
    groups: groups ? safeJson(groups) : [],
  });

  export const getServerSideProps = async (
    context: GetServerSidePropsContext,
  ): Promise<{ groups: ParseToRaw<Groups[]> }> => {
    const session = await getSession(context);
    if (session === null) return serverSideProps();
    const id = (session.user as any)?.id;
    if (!id) return serverSideProps();
    const userGroups = await User.getFriends(id);
    return userGroups.isSuccess()
      ? serverSideProps(userGroups.success)
      : serverSideProps();
  };
}
