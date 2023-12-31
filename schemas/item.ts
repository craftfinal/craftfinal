// @/schemas/item.ts

import { ItemDisposition } from "@/types/item";
import { itemDescendantModelHierarchy } from "@/types/itemDescendant";
import { z } from "zod";
import { stateIdSchema, clientIdSchema } from "./id";

const itemDataSchema = z.object({});

const itemPersistSchema = z.object({
  // This value is assigned by the database and cannot be empty
  createdAt: z.date(), //.default(new Date(0)),
  // This value is assigned by the database and cannot be empty
  lastModified: z.date(), //.default(new Date(0)),
  // This value is assigned when the item is deleted and is normally null
  deletedAt: z.date().nullable(),
});

const itemPersistClientSchema = z.object({
  clientId: clientIdSchema,
  parentClientId: clientIdSchema.optional(),
});

const itemPersistServerSchema = z.object({
  parentId: stateIdSchema,
  id: stateIdSchema, //.default(idDefault), // UUID
});

const itemStateSchema = z.object({
  disposition: z.nativeEnum(ItemDisposition),
  itemModel: z.enum(itemDescendantModelHierarchy),
  descendantModel: z.union([z.enum(itemDescendantModelHierarchy), z.null()]),
});

export const itemSchema = {
  form: itemDataSchema,
  display: itemDataSchema,
  persist: itemPersistSchema,
  persistClient: itemDataSchema
    .merge(itemPersistSchema)
    .merge(itemPersistClientSchema)
    .merge(itemStateSchema)
    .merge(itemPersistServerSchema.partial()),
  persistServer: itemDataSchema.merge(itemPersistSchema).merge(itemPersistServerSchema),
};

export type ItemInputType = z.input<typeof itemSchema.persistServer>;
export type ItemOutputType = z.output<typeof itemSchema.persistServer>;

// Type used by client to maintain client state
// export type ItemClientStateType = ItemClientToServerType & {
//   clientId: ClientIdType;
//   parentClientId: ClientIdType;
// };
export const itemClientStateSchema = itemSchema.persistClient.merge(itemStateSchema);
export type ItemClientStateType = z.output<typeof itemClientStateSchema>;

// Orderable client state type, for items that can be ordered and
// therefore require a numeric `order` field that can be persisted in a table
// export type ItemOrderableClientStateType = ItemClientStateType & {
//   order: number;
// };
export const itemOrderableClientStateSchema = itemClientStateSchema.extend({
  order: z.number(),
});
// Note: the below does not seem to include the `order` property for some reason
// export type ItemOrderableClientStateType = z.output<typeof itemOrderableClientStateSchema>;
export type ItemOrderableClientStateType = ItemClientStateType & {
  order: number;
};

// Type used when client sends items to server for merge
// Since `id` and `parentId` both refer to server-generated identifiers, the client
// must be able to operate without them.
// So when creating new items, or even descendants of new items, it will assign
// export type ItemClientToServerType = Omit<ItemOutputType, "id" | "parentId"> & {
//   clientId?: IdSchemaType;
//   id?: IdSchemaType;
//   parentId?: IdSchemaType;
//   disposition: ItemDisposition;
// };
// Use z.output to derive the ItemClientToServerType type
export const itemClientToServerTypeSchema = itemClientStateSchema;
export type ItemClientToServerType = z.output<typeof itemClientToServerTypeSchema>;

// Type persisted by server
// Use z.output to derive the ItemServerOutputType type
export const itemServerOutputSchema = itemSchema.persistServer;
export type ItemServerOutputType = z.output<typeof itemServerOutputSchema>;

// Type returned by server in response to items received from client to merge with server's state
// export type ItemServerToClientType = ItemOutputType & {
//   clientId?: IdSchemaType;
// };
// Use z.output to derive the ItemServerToClientType type
export const itemServerToClientSchema = itemSchema.persistServer.merge(itemStateSchema).extend({
  clientId: clientIdSchema.optional(),
  parentClientId: clientIdSchema.optional(),
});
export type ItemServerToClientType = z.output<typeof itemServerToClientSchema>;

// Type used by server to deal with both server and client persistence and state types
// This is the full-fledged Prisma schema,
// - extended with `itemModel` and `descendantModel` to enable navigating the item model hierarchy
// - extended with `disposition` to make it compatible with `ItemClientStateType`
// export type ItemServerStateType = ItemOutputType & {
//   clientId: ClientIdType;
//   parentClientId: ClientIdType;
//   itemModel: ItemDescendantModelNameType;
//   descendantModel: ItemDescendantModelNameType;
//   disposition: ItemDisposition;
// };
// Add all properties of itemPersistClientSchema as optional
// FIXME: Avoid merging with the complete `itemClientStateSchema` as this makes all shared properties optional
export const itemServerStateSchema = itemSchema.persistServer
  .merge(itemStateSchema)
  .merge(itemPersistClientSchema.partial());

// Derive types from the merged schema
export type ItemServerStateType = z.output<typeof itemServerStateSchema>;

// Orderable server state type, for items that can be ordered and
// therefore require a numeric `order` field that can be persisted in a table
// export type ItemOrderableServerStateType = ItemServerStateType & {
//   order: number;
// };
export const itemOrderableServerStateSchema = itemServerStateSchema.extend({
  order: z.number(),
});
// Note: the below does not seem to include the `order` property for some reason
// export type ItemOrderableServerStateType = z.output<typeof itemOrderableServerStateSchema>;
export type ItemOrderableServerStateType = ItemServerStateType & {
  order: number;
};

// An object with fields that are specific to the item, i.e., excluding all the fields shared
// between `Resume`, `Organization`, `Role` and `Achievement`
export type ItemDataType<T> = Omit<T, keyof ItemClientStateType>;
export type ItemDataFieldNameType<T> = keyof ItemDataType<T>;

// FIXME: The following two types don't add much type safety but
// are currently used to be able to work with components without a type parameter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type ItemDataUntypedType = Omit<Record<string, any>, keyof ItemClientStateType>;
export type ItemDataUntypedType = Record<string, string | number>;
export type ItemDataUntypedFieldNameType = keyof ItemDataUntypedType;
