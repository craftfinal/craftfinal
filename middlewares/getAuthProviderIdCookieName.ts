import { siteConfig } from "@/config/site";
import { ClientIdSchemaType } from "@/schemas/id";

export function getAuthProviderIdCookieName(): ClientIdSchemaType {
  const cookieNameSuffix =
    process.env.NODE_ENV === "development" ? `devel.${siteConfig.canonicalDomainName}` : siteConfig.canonicalDomainName;
  const userIdCookieName = `userId.` + cookieNameSuffix;
  return userIdCookieName;
}
