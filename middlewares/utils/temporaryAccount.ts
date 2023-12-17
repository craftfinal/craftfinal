// @/schemas/utils/temporaryUser.ts

import { siteConfig } from "@/config/site";
import { uuidRegex } from "@/types/utils/uuidId";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { ClientIdSchemaType } from "@/schemas/id";

export const temporaryAccountMiddlewareId = "temporaryaccount";

const temporaryAccountIdPrefix = temporaryAccountMiddlewareId.substring(0, 4) + "_";

const temporaryAccountIdRegex = String.raw`^` + temporaryAccountIdPrefix + uuidRegex.substring(1);
export const temporaryAccountIdSchema = z.string().regex(new RegExp(temporaryAccountIdRegex));
export type TemporaryAccountIdSchemaType = z.infer<typeof temporaryAccountIdSchema>;

export const isValidTemporaryAccountId = (id: string | null | undefined): boolean => {
  if (typeof id !== "string") return false;

  try {
    temporaryAccountIdSchema.parse(id);
    return true;
  } catch (error) {
    return false;
  }
};

// Generate a new unique ID for the temporary account
export function generateTemporaryAccountId() {
  const id = `${temporaryAccountIdPrefix}${uuidv4()}`;
  if (isValidTemporaryAccountId(id)) {
    return id;
  }
  throw Error(`generateTemporaryAccountId: id="${id}" failed validation`);
}
export function getAccountProviderIdCookieName(): ClientIdSchemaType {
  const cookieNameSuffix =
    process.env.NODE_ENV === "development" ? `devel.${siteConfig.canonicalDomainName}` : siteConfig.canonicalDomainName;
  const userIdCookieName = `userId.` + cookieNameSuffix;
  return userIdCookieName;
}
