// @/schemas/utils/temporaryUser.ts

import { uuidRegex } from "@/schemas/id";
import { v4 } from "uuid";
import z from "zod";

export const temporaryAccountMiddlewareId = "temporaryaccount";

const temporaryAccountIdPrefix = temporaryAccountMiddlewareId.substring(0, 4) + "_";

const temporaryAccountIdRegex = String.raw`^` + temporaryAccountIdPrefix + uuidRegex.substring(1);
export const temporaryAccountIdSchema = z.string().regex(new RegExp(temporaryAccountIdRegex));
export type TemporaryAccountIdSchemaType = z.infer<typeof temporaryAccountIdSchema>;

export const isValidTemporaryAccountId = (id: string | null | undefined): boolean => {
  if (!(typeof id === "string")) return false;

  try {
    temporaryAccountIdSchema.parse(id);
    return true;
  } catch (error) {
    return false;
  }
};

// Generate a new unique ID for the temporary user
export function generateTemporaryAccountId() {
  const id = `${temporaryAccountIdPrefix}${v4()}`;
  if (isValidTemporaryAccountId(id)) {
    return id;
  }
  throw Error(`generateTemporaryAccountId: id="${id}" failed validation`);
}
