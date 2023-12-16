// @/schemas/id.ts

import {
  Base58CheckIdSchemaType,
  ModelIndicator,
  ModelIndicatorNameType,
  ModelIndicatorType,
  base58CheckIdDefault,
  base58CheckIdRegex,
  base58CheckIdSchema,
  generateBase58CheckId,
  getBase58CheckIdFromUuidAndModel,
  getDbIdFromBase58CheckId,
  getItemModelFromBase58CheckId,
  getPrefixFromBase58CheckId,
  getUuidAndModelFromBase58CheckId,
  isValidBs58CheckId,
} from "@/types/utils/base58checkId";
import { UuidIdSchemaType, isValidUuidId, uuidIdDefault, uuidIdSchema } from "@/types/utils/uuidId";

/*
 * DATABASE identifiers used in Prisma
 */

// Database ID validation schema
export const dbIdSchema = uuidIdSchema;
export const dbIdDefault = uuidIdDefault;

export type DbIdSchemaType = UuidIdSchemaType;

export function isValidDbId(id: string | null | undefined): boolean {
  return isValidUuidId(id);
}

/*
 * STATE identifiers are used everywhere except in the database:
 * - User-visible IDs, such as in URLs
 * - Communication between client and server
 * - Persistence on the client in localStorage
 * NOTE: this ID is of variable length due to the compression by `base58check`
 */
// State ID validation schema
export const stateIdSchema = base58CheckIdSchema;
export const stateIdDefault = base58CheckIdDefault;
export type StateIdSchemaType = Base58CheckIdSchemaType;

export const stateIdRegex = base58CheckIdRegex;

export function generateStateId(model: ModelIndicatorType | ModelIndicatorNameType | undefined) {
  return generateBase58CheckId(model);
}

export function isValidStateId(id: string | null | undefined): boolean {
  return isValidBs58CheckId(id);
}

export function getStateIdFromDbId(
  uuid: string,
  model: ModelIndicatorType | ModelIndicatorNameType = ModelIndicator.default,
) {
  if (typeof model === "string") {
    return getBase58CheckIdFromUuidAndModel(uuid, ModelIndicator[model]);
  }
  return getBase58CheckIdFromUuidAndModel(uuid, model);
}

export function getDbIdFromStateId(id: string) {
  return getDbIdFromBase58CheckId(id);
}

export function getDbIdAndModelFromStateId(id: string): { dbId: string; model: ModelIndicatorNameType } {
  const uuidAndModel = getUuidAndModelFromBase58CheckId(id);
  return { ...uuidAndModel, dbId: uuidAndModel.uuid };
}

/*
 * CLIENT identifiers used in localStorage
 * NOTE: this ID is of can be variable length due to the compression by `base58check`
 */
export const clientIdSchema = base58CheckIdSchema;
export const clientIdDefault = base58CheckIdDefault;
export type ClientIdSchemaType = Base58CheckIdSchemaType;

export function generateClientId(model: ModelIndicatorType | ModelIndicatorNameType | undefined) {
  return generateBase58CheckId(model);
}

export function isValidClientId(id: string | null | undefined): boolean {
  return isValidBs58CheckId(id);
}

export function getItemModelFromStateId(id: string): string {
  return getItemModelFromBase58CheckId(id);
}

export function getItemModelOrNullFromStateId(id: string | null | undefined): string | null {
  if (id) {
    try {
      return getItemModelFromStateId(id);
    } catch (error) {
      /* empty */
    }
  }
  return null;
}

export function getClientIdFromStateId(id: string): ClientIdSchemaType {
  return id;
}

export function renderClientIdPrefix(id: string | null | undefined, length: number = 4): string | null {
  if (id) {
    try {
      return getPrefixFromBase58CheckId(id, length);
    } catch (error) {
      /* empty */
    }
  }
  return null;
}
