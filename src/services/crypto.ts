import crypto from "node:crypto";
import { uuidv7 } from "@kripod/uuidv7";
import bcrypt from "bcrypt";
import { DB } from "~/db/types";
import { secrets } from "~/db/users";
import { db } from "~/db";
import { Either } from "~/lib/either";
import { Nullable, Override } from "~/types";
import { and, eq, isNull } from "drizzle-orm";

export enum CryptoTypes {
  Pair = "pair",
  Password = "password",
  Jwt = "jwt",
  ApiToken = "api_token",
}

export namespace CryptoDatabase {
  export type SecretPair = Override<
    DB.Secret,
    { type: CryptoTypes.Pair; public: string }
  >;

  export type SecretPassword = Override<
    DB.Secret,
    { type: CryptoTypes.Pair; public: "" }
  >;

  export const getSecretByType = async <T extends DB.Secret = DB.Secret>(
    type: CryptoTypes,
  ): Promise<Nullable<T>> => {
    const result = await db
      .select()
      .from(secrets)
      .where(and(isNull(secrets.deletedAt), eq(secrets.type, type)))
      .limit(1);
    return result[0] as unknown as Nullable<T>;
  };

  export const insert = async (data: DB.Secret) => {
    await db.insert(secrets).values(data);
    return data;
  };
}

export namespace Crypto {
  const SALT = 1024;

  export const getPair = async () =>
    (await CryptoDatabase.getSecretByType(CryptoTypes.Pair))!;

  export const getJwt = async () =>
    (await CryptoDatabase.getSecretByType<CryptoDatabase.SecretPair>(
      CryptoTypes.Jwt,
    ))!;

  export const getSalt = async () =>
    (await CryptoDatabase.getSecretByType<CryptoDatabase.SecretPassword>(
      CryptoTypes.Password,
    ))!;

  export const getById = Either.transform(
    async <T extends DB.Secret>(id: string): Promise<T> => {
      const r = await db
        .select()
        .from(secrets)
        .where(eq(secrets.id, id))
        .execute();
      return r as unknown as T;
    },
  );

  function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  function bufferToString(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const exponent = new Uint8Array([1, 0, 1]);

  const binaryPem = (pem: string, type: "PUBLIC" | "PRIVATE") => {
    const pemHeader = `-----BEGIN ${type} KEY-----`;
    const pemFooter = `-----END ${type} KEY-----`;
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length,
    );
    const binaryDerString = atob(pemContents);
    return str2ab(binaryDerString);
  };

  const generateRsaOaepPair = async (hash: string = "SHA-256") => {
    const pair = await crypto.subtle.generateKey(
      { name: "RSA-OAEP", modulusLength: 4096, publicExponent: exponent, hash },
      true,
      ["encrypt", "decrypt"],
    );
    const privateKey = bufferToString(
      await crypto.subtle.exportKey("pkcs8", pair.privateKey),
    );
    const publicKey = bufferToString(
      await crypto.subtle.exportKey("spki", pair.publicKey),
    );
    return {
      public: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
      private: `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`,
    };
  };

  const base64 = {
    decode: (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
    encode: (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b))),
  };

  const cryptoPrivateKey = async (privateKey: string) =>
    await crypto.subtle.importKey(
      "pkcs8",
      binaryPem(privateKey, "PRIVATE"),
      { name: "RSA-OAEP", hash: "SHA-256", length: 4096 },
      true,
      ["decrypt"],
    );

  const decryptText = async (
    privateKey: CryptoKey,
    target: string,
  ): Promise<string> => {
    const s = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      base64.decode(target),
    );
    return atob(base64.encode(s));
  };

  export const create = async (
    publicKey: string,
    secret: string,
    type: CryptoTypes,
  ) => {
    const id = uuidv7();
    const now = new Date();
    return await CryptoDatabase.insert({
      id,
      type,
      createdAt: now,
      secret: secret,
      deletedAt: null,
      public: publicKey,
      createdBy: "system",
    });
  };

  export const decrypt = async (
    pair: CryptoDatabase.SecretPair,
    encryptedText: string,
  ) => {
    const importedPrivateKey = await cryptoPrivateKey(pair.secret!);
    return await decryptText(importedPrivateKey, encryptedText);
  };

  const setupConfig = [
    {
      test: async () => (await getSalt()) === null,
      create: async () =>
        await create("", bcrypt.genSaltSync(SALT), CryptoTypes.Password),
    },
    {
      test: async () => (await getJwt()) === null,
      create: async () => {
        const pair = await generateRsaOaepPair("SHA-512");
        await create(pair.public, pair.private, CryptoTypes.Jwt);
      },
    },
    {
      test: async () => (await getPair()) === null,
      create: async () => {
        const pair = await generateRsaOaepPair();
        await create(pair.public, pair.private, CryptoTypes.Pair);
      },
    },
  ];

  export const setup = async () =>
    await Promise.all(
      setupConfig.map(async (config) => {
        const shouldExec = await config.test();
        if (shouldExec) await config.create();
      }),
    );
}
