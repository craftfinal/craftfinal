// @/middlewares/withTemporaryUser.ts

import {
  generateTemporaryAccountId,
  isValidTemporaryAccountId,
  temporaryAccountMiddlewareId,
} from "@/schemas/utils/temporaryAccount";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";
import { getAuthProviderIdCookieName } from "./getAuthProviderIdCookieName";

const withTemporaryAccount: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = await nextMiddlewareHandler(request, event);

    const authProviderIdCookieName = getAuthProviderIdCookieName();

    if (response instanceof NextResponse) {
      const providerAccountCookie = request.cookies.get(authProviderIdCookieName);
      const providerAccountId = providerAccountCookie?.value;
      if (providerAccountId && isValidTemporaryAccountId(providerAccountId)) {
        console.log(
          `withTemporaryUser: cookie "${authProviderIdCookieName}" contains valid accountId "${providerAccountId}"`,
        );
      } else {
        // We cannot run Prisma here in midleware
        // Set the cookie on the response, which will later on lead to the creation of a user and account in Prisma
        // Generate a new unique ID for the temporary user
        const newAuthProviderId = generateTemporaryAccountId();

        response.cookies.set(authProviderIdCookieName, newAuthProviderId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
        console.log(
          `withTemporaryUser: set cookie "${authProviderIdCookieName}" with new accountId "${newAuthProviderId}"`,
        );
      }
    }
    return response;
  };
};

const temporaryAccountMiddleware: MiddlewareEntry = {
  // FIXME: temporaryAccountMiddlewareId had to be defined externally to avoid circular dependencies
  id: temporaryAccountMiddlewareId,
  fn: withTemporaryAccount,
  // disabled: true,
};
export default temporaryAccountMiddleware;
