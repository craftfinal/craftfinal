// schemas/itemDescendantSettings.ts
import * as z from "zod";

export const itemDescendantSettingsSchema = z.object({
  autoSyncDelay: z.number().min(0.1).max(300),
  autoSyncBackoffBase: z.number().min(1.1).max(4),
  autoSyncBackoffExponentScaleFactor: z.number().min(1).max(10),
  autoSyncBackoffExponentMax: z.number().min(1).max(10),

  showItemDescendantInternals: z.boolean(),
  showItemDescendantIdentifiers: z.boolean(),
  showItemDescendantSynchronization: z.boolean(),
  allowDeleteAllItems: z.boolean(),
});

export type SettingsFormType = z.infer<typeof itemDescendantSettingsSchema>;
