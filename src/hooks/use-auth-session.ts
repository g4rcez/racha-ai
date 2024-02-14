import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Links } from "~/router";

export const useAuthSession = () => {
  const router = useRouter();
  return useSession({
    required: true,
    onUnauthenticated: async () => {
      await router.push(Links.login);
    },
  });
};
