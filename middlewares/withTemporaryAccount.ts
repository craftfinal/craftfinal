// @/middlewares/withTemporaryAccount.ts

import {
  generateTemporaryAccountId,
  isValidTemporaryAccountId,
  temporaryAccountMiddlewareId,
} from "@/schemas/utils/temporaryAccount";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";
import { getAuthProviderIdCookieName } from "./getAuthProviderIdCookieName";

export const accountIdToCreateHeader: string = `x-${temporaryAccountMiddlewareId}-create-id`.toLowerCase();

const withTemporaryAccount: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = await nextMiddlewareHandler(request, event);

    const authProviderIdCookieName = getAuthProviderIdCookieName();

    if (response instanceof NextResponse) {
      const providerAccountCookie = request.cookies.get(authProviderIdCookieName);
      const providerAccountId = providerAccountCookie?.value;
      if (providerAccountId && isValidTemporaryAccountId(providerAccountId)) {
        // console.log(
        //   `withTemporaryAccount: cookie "${authProviderIdCookieName}" contains valid accountId "${providerAccountId}"`,
        // );
      } else {
        // We cannot run Prisma here in midleware
        // Set the cookie on the response, which will later on lead to the creation of a user and account in Prisma
        // Generate a new unique ID for the temporary account
        const newAuthProviderId = generateTemporaryAccountId();

        const cookieOptions = {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          httpOnly: true, // Protect against XSS attacks
          secure: process.env.NODE_ENV !== "development", // Use secure cookies in production (requires HTTPS)
          sameSite: "strict" as const, // Helps against CSRF attacks, 'as const' ensures TypeScript treats it as a literal type
          path: "/", // Cookie will be accessible for the whole site
        };

        response.cookies.set(authProviderIdCookieName, newAuthProviderId, cookieOptions); // 30 days
        response.headers.set(accountIdToCreateHeader, newAuthProviderId);
        console.log(
          `withTemporaryAccount: set cookie "${authProviderIdCookieName}" with new accountId "${newAuthProviderId}"`,
        );
      }
    } else {
      console.log(`withTemporaryAccount: response not instanceof NextResponse: typeof response=${typeof response}`);
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
