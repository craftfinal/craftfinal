// @/schemas/user.ts

import { itemSchema } from "@/schemas/item";
import { z } from "zod";
import { dbIdSchema } from "./id";
import { itemClientStateSchema } from "./item";

export const userFormSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const userPersistServerSchema = z.object({
  id: dbIdSchema,
});

export const userSchema = {
  form: userFormSchema,
  display: userFormSchema,
  persistServer: itemSchema.persist.merge(userFormSchema.merge(userPersistServerSchema)),
};

export type UserInputType = z.input<typeof userSchema.persistServer>;
export type UserOutputType = z.output<typeof userSchema.persistServer>;

export const userItemClientStateSchema = itemClientStateSchema.merge(userFormSchema);
export type UserItemClientStateType = z.input<typeof userItemClientStateSchema>;
