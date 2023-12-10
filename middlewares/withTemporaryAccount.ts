import { siteConfig } from "@/config/site";
import { IdSchemaType, getAuthProviderId } from "@/schemas/id";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./executeMiddleware";

const withTemporaryAccount: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = await nextMiddlewareHandler(request, event);

    const authProviderIdCookieName = getAuthProviderIdCookieName();

    if (response instanceof NextResponse) {
      const authProviderId = request.cookies.get(authProviderIdCookieName);

      if (!authProviderId) {
        // Generate a new unique ID for the temporary user
        const newAuthProviderId = getAuthProviderId("temporary");

        // Set the cookie on the response
        response.cookies.set(authProviderIdCookieName, newAuthProviderId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
      }
    }
    return response;
  };
};

export default withTemporaryAccount;

export function getAuthProviderIdCookieName(): IdSchemaType {
  const cookieNameSuffix =
    process.env.NODE_ENV === "development" ? `devel.${siteConfig.canonicalDomainName}` : siteConfig.canonicalDomainName;
  const userIdCookieName = `userId.` + cookieNameSuffix;
  return userIdCookieName;
}
