import z from "zod";

// Match a UUID. Source: https://ihateregex.io/expr/uuid/
export const uuidRegex = String.raw`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`;
export const uuidIdRegex = uuidRegex;

/*
 * SERVER identifiers used in Prisma
 */

// UUID validation schema
export const uuidIdSchema = z.string().regex(new RegExp(uuidIdRegex));
export const uuidIdDefault = "00000000-0000-0000-0000-000000000000";

export type UuidIdSchemaType = z.infer<typeof uuidIdSchema>;

export function isValidUuidId(id: string | null | undefined): boolean {
  if (!(typeof id === "string")) return false;

  try {
    uuidIdSchema.parse(id);
    return true;
  } catch (error) {
    return false;
  }
}
