import { siteConfig } from "@/config/site";
import { IdSchemaType } from "@/schemas/id";

export function getAuthProviderIdCookieName(): IdSchemaType {
  const cookieNameSuffix =
    process.env.NODE_ENV === "development" ? `devel.${siteConfig.canonicalDomainName}` : siteConfig.canonicalDomainName;
  const userIdCookieName = `userId.` + cookieNameSuffix;
  return userIdCookieName;
}
