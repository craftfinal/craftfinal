// schemas/appSettings.ts
import * as z from "zod";

export const appSettingsSchema = z.object({
  autoSyncDelay: z.number().min(0).max(86400),
  autoSyncBackoffBase: z.number().min(1).max(10),
  autoSyncBackoffExponent: z.number().min(1).max(10),
  autoSyncBackoffExponentMax: z.number().min(1).max(10),

  showItemDescendantInternals: z.boolean(),
  showItemDescendantIdentifiers: z.boolean(),
  showItemDescendantSynchronization: z.boolean(),
  // allowDeleteAllItems: z.boolean(),
  // impersonatingUserAuthProviderId: z.string().uuid().nullable(),
  isLoggingEnabled: z.boolean(),
});

export type SettingsFormType = z.infer<typeof appSettingsSchema>;
