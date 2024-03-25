import { uuidv7 } from "@kripod/uuidv7";
import { DB } from "~/db/types";

export namespace Auth {
  type Credentials = {
    name: string;
    email: string;
    secretId: string;
  };

  export const register = async (
    credentials: Credentials,
  ): Promise<DB.User> => {
    const now = new Date();
    const id = uuidv7();
    return {
      id,
      email: credentials.email,
      name: credentials.name,
      createdAt: now,
      image: "",
      password: "",
      secretId: "",
      preferences: {},
    };
  };
}
