import { AccountWithUser, Base58CheckAccount, Base58CheckUser } from "@/types/user";
import { User } from "@prisma/client";
import bs58check from "bs58check";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { uuidIdDefault } from "./uuidId";

export enum ModelIndicator {
  Default = 0, // Default value indicates a programmatically generated model
  User = 32, // The user is at the center of our design philosophy :-)
  Organization = 33, // Content models start at 32
  Role = 34,
  Achievement = 35,
  Account = 128, // Auxiliary models start at 128
  Invalid = 255, // Reserved to indicate an invalid model
}

export type ModelIndicatorType = ModelIndicator;
export type ModelIndicatorNameType = keyof typeof ModelIndicator;

export function getBase58CheckIdFromUuidAndModel(uuid: string, model = ModelIndicator.Default): string {
  const buffer = Buffer.from([model, ...Buffer.from(uuid.replace(/-/g, ""), "hex")]);
  return bs58check.encode(buffer);
}

export function getUuidAndModelFromBase58CheckId(id: string): { uuid: string; model: ModelIndicatorNameType } {
  const decoded = bs58check.decode(id);
  const buffer = Buffer.from(decoded.buffer, decoded.byteOffset, decoded.byteLength);
  const hex = buffer.toString("hex");

  // The first byte is the model indicator
  const modelIndicator = buffer[0];
  const model = ModelIndicator[modelIndicator] as ModelIndicatorNameType;
  if (model === undefined) {
    throw new Error(`Unknown model indicator: ${modelIndicator}`);
  }

  // The rest of the buffer is the UUID in hex format
  const uuid = [hex.slice(2, 10), hex.slice(10, 14), hex.slice(14, 18), hex.slice(18, 22), hex.slice(22)].join("-");

  return { uuid, model };
}

export function generateBs58CheckId(model: ModelIndicatorType | ModelIndicatorNameType | undefined) {
  const uuid = uuidv4();
  if (typeof model === "string") {
    return getBase58CheckIdFromUuidAndModel(uuid, ModelIndicator[model]);
  }
  return getBase58CheckIdFromUuidAndModel(uuid, model);
}

export function userFromUser(user: User): Base58CheckUser {
  const base58CheckUserId = getBase58CheckIdFromUuidAndModel(user.id, ModelIndicator.User);

  const transformedUser: Base58CheckUser = {
    ...user,
    id: base58CheckUserId,
  };

  return transformedUser;
}

export function userAccountFromAccount(account: AccountWithUser) {
  const base58CheckAccountId = getBase58CheckIdFromUuidAndModel(account.id, ModelIndicator.Account);

  const transformedUser: Base58CheckUser = userFromUser(account.user);

  const transformedAccount: Base58CheckAccount = {
    ...account,
    id: base58CheckAccountId,
    user: transformedUser,
  };

  return transformedAccount;
}

// Regex for base58check encoded strings
export const bs58CheckIdRegex = /^[1-9A-HJ-NP-Za-km-z]+$/;

// Zod schema for base58check encoded ID validation
export const bs58CheckIdSchema = z.string().regex(bs58CheckIdRegex);

export type Bs58CheckIdSchemaType = z.infer<typeof bs58CheckIdSchema>;

export function isValidBs58CheckId(id: string | null | undefined): boolean {
  try {
    return typeof id === "string" ? !!getUuidAndModelFromBase58CheckId(id) : false;
  } catch (error) {
    return false;
  }
}

// Generate default base58check identifier using the default UUIDv4 and default Model Indicator
export const bs58CheckIdDefault = getBase58CheckIdFromUuidAndModel(uuidIdDefault, ModelIndicator.Default);

export function getItemModelFromBase58CheckId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  if (isValidBs58CheckId(id)) {
    const uuidAndModel = getUuidAndModelFromBase58CheckId(id);
    return uuidAndModel.model;
  }
  return undefined;
}

export function getDbIdFromBase58CheckId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  if (isValidBs58CheckId(id)) {
    const uuidAndModel = getUuidAndModelFromBase58CheckId(id);
    return uuidAndModel.uuid;
  }
  return undefined;
}

export function getPrefixFromBase58CheckId(id: string | null | undefined, length: number = 4): string | undefined {
  if (!id) return undefined;
  if (isValidBs58CheckId(id)) {
    return getDbIdFromBase58CheckId(id)?.substring(4, 4 + length);
  }
  return undefined;
}
