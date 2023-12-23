// schemas/appSettings.ts
import * as z from "zod";

export const appSettingsSchema = z.object({
  // impersonatingUserAuthProviderId: z.string().uuid().nullable(),
  isLoggingEnabled: z.boolean(),
});

export type SettingsFormType = z.infer<typeof appSettingsSchema>;
