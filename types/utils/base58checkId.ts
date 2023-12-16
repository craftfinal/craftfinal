import { AccountWithUser, Base58CheckAccount, Base58CheckUser } from "@/types/user";
import { User } from "@prisma/client";
import bs58check from "bs58check";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { uuidIdDefault } from "./uuidId";

export enum ModelIndicator {
  default = 0, // Default value indicates a programmatically generated model
  user = 32, // The user is at the center of our design philosophy :-)
  resume = 33, // Content models start at 32
  organization = 34, // Content models start at 32
  role = 35,
  achievement = 36,
  account = 128, // Auxiliary models start at 128
  invalid = 255, // Reserved to indicate an invalid model
}

export type ModelIndicatorType = ModelIndicator;
export type ModelIndicatorNameType = keyof typeof ModelIndicator;

export function getBase58CheckIdFromUuidAndModel(uuid: string, model = ModelIndicator.default): string {
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

export function generateBase58CheckId(model: ModelIndicatorType | ModelIndicatorNameType | undefined) {
  const uuid = uuidv4();
  if (typeof model === "string") {
    return getBase58CheckIdFromUuidAndModel(uuid, ModelIndicator[model]);
  }
  return getBase58CheckIdFromUuidAndModel(uuid, model);
}

export function stateUserFromDbUser(user: User): Base58CheckUser {
  const base58CheckUserId = getBase58CheckIdFromUuidAndModel(user.id, ModelIndicator.user);

  const transformedUser: Base58CheckUser = {
    ...user,
    id: base58CheckUserId,
  };

  return transformedUser;
}

export function stateAccountFromDbAccount(account: AccountWithUser) {
  const base58CheckAccountId = getBase58CheckIdFromUuidAndModel(account.id, ModelIndicator.account);

  const transformedUser: Base58CheckUser = stateUserFromDbUser(account.user);

  const transformedAccount: Base58CheckAccount = {
    ...account,
    id: base58CheckAccountId,
    user: transformedUser,
  };

  return transformedAccount;
}

// Regex for base58check encoded strings
// uuidIdDefault, model: "default" base58Check-encoded: `1111111111111111129Cs8b` (23 characters)
// uuidIdDefault, model: "user"    base58Check-encoded: `2y8ShWp5uBa1jbLNKCF5yorW3t98J` (29 characters)
export const base58CheckIdRegex = /^[1-9A-HJ-NP-Za-km-z]{23,29}$/;

// Zod schema for base58check encoded ID validation
export const base58CheckIdSchema = z.string().regex(base58CheckIdRegex);

export type Base58CheckIdSchemaType = z.infer<typeof base58CheckIdSchema>;

// Generate default base58check identifier using the default UUIDv4 and default Model Indicator
export const base58CheckIdDefault = getBase58CheckIdFromUuidAndModel(uuidIdDefault, ModelIndicator.default);

export function isValidBs58CheckId(id: string | null | undefined): boolean {
  try {
    return typeof id === "string" ? !!getUuidAndModelFromBase58CheckId(id) : false;
  } catch (error) {
    return false;
  }
}

export function getItemModelFromBase58CheckId(id: string): string {
  if (isValidBs58CheckId(id)) {
    const uuidAndModel = getUuidAndModelFromBase58CheckId(id);
    return uuidAndModel.model;
  }
  throw Error(`getItemModelFromBase58CheckId(id=${id}): invalid base58CheckId`);
}

export function getDbIdFromBase58CheckId(id: string): string {
  if (isValidBs58CheckId(id)) {
    const uuidAndModel = getUuidAndModelFromBase58CheckId(id);
    return uuidAndModel.uuid;
  }
  throw Error(`getItemModelFromBase58CheckId(id=${id}): invalid base58CheckId`);
}

export function getPrefixFromBase58CheckId(id: string, length: number = 4): string {
  if (isValidBs58CheckId(id)) {
    return getDbIdFromBase58CheckId(id)?.substring(4, 4 + length);
  }
  throw Error(`getItemModelFromBase58CheckId(id=${id}): invalid base58CheckId`);
}
