import { AppRouteType, authenticatedRouteLayouts } from "@/config/appRoutes";
import { siteConfig } from "@/config/site";
import { ClientIdSchemaType } from "@/schemas/id";
import { uuidRegex } from "@/types/utils/uuidId";
import { SessionOptions } from "iron-session";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

export const ironSessionAccountMiddlewareId = "ironsessionaccount";

export interface SessionData {
  accountId: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  accountId: "",
  isLoggedIn: false,
};

export const sessionOptions: Record<string, SessionOptions> = {
  [AppRouteType.Authenticated]: {
    password: process.env.IRON_SESSION_ACCOUNT_SECRET ?? "",
    cookieName: getIronSessionCookieName(),
    cookieOptions: {
      // Setting `secure: true` only in production as it implies `https`
      secure: process.env.NODE_ENV === "production",
    },
  },
};

const ironSessionIdPrefix = ironSessionAccountMiddlewareId.substring(0, 4) + "_";

const ironSessionIdRegex = String.raw`^` + ironSessionIdPrefix + uuidRegex.substring(1);
export const ironSessionIdSchema = z.string().regex(new RegExp(ironSessionIdRegex));
export type IronSessionIdSchemaType = z.infer<typeof ironSessionIdSchema>;

export const isValidIronSessionId = (id: string | null | undefined): boolean => {
  if (typeof id !== "string") return false;

  try {
    ironSessionIdSchema.parse(id);
    return true;
  } catch (error) {
    return false;
  }
};

// Generate a new unique ID for the temporary account
export function generateIronSessionId() {
  const id = `${ironSessionIdPrefix}${uuidv4()}`;
  if (isValidIronSessionId(id)) {
    return id;
  }
  throw Error(`generateIronSessionId: id="${id}" failed validation`);
}

export function revalidateAuthenticatedPaths() {
  for (const layout of authenticatedRouteLayouts) {
    revalidatePath(layout, "layout");
  }
}

export function getIronSessionCookieName(): ClientIdSchemaType {
  const cookieNameSuffix =
    process.env.NODE_ENV === "development" ? `devel.${siteConfig.canonicalDomainName}` : siteConfig.canonicalDomainName;
  const sessionCookieName = `${ironSessionAccountMiddlewareId}.${cookieNameSuffix}`;
  return sessionCookieName;
}
