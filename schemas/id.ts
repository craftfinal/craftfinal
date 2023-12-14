// @/schemas/id.ts

import { v4 } from "uuid";
import { z } from "zod";
import { getUuidAndModelFromId } from "./utils/base58checkUUID";

// Match a UUID. Source: https://ihateregex.io/expr/uuid/
export const uuidRegex = String.raw`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`;
export const idRegex = uuidRegex;

/*
 * SERVER identifiers used in Prisma
 */

// UUID validation schema
export const idSchema = z.string().regex(new RegExp(idRegex));
export const idDefault = "00000000-0000-0000-0000-000000000000";

export type IdSchemaType = z.infer<typeof idSchema>;

export const isValidItemId = (id: string | null | undefined): boolean => {
  if (!(typeof id === "string")) return false;

  try {
    idSchema.parse(id);
    return true;
  } catch (error) {
    return false;
  }
};

export function getItemId(): string {
  return v4();
}

/*
 * CLIENT identifiers used in Zustand
 * Exactly the same as server ids.
 */
export const clientIdSchema = idSchema; // Same as server
export const clientIdDefault = "00000000-0000-0000-0000-000000000000";

export type ClientIdSchemaType = z.infer<typeof clientIdSchema>;

export function getClientId() {
  return getItemId();
}

export const isValidClientId = (id: string | null | undefined): boolean => {
  return isValidItemId(id);
};

export function getItemModelFromId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  if (isValidItemId(id)) {
    const uuidAndModel = getUuidAndModelFromId(id);
    return uuidAndModel.model;
  }
  return undefined;
}

export function getUuidFromId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  if (isValidItemId(id)) {
    const uuidAndModel = getUuidAndModelFromId(id);
    return uuidAndModel.uuid;
  }
  return undefined;
}

export function getPrefixFromId(id: string | null | undefined, length: number = 4): string | undefined {
  if (!id) return undefined;
  if (isValidItemId(id)) {
    return getUuidFromId(id)?.substring(4, 4 + length);
  }
  return undefined;
}
