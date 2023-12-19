// @/middlewares/withIronSessionAccount.ts

import {
  SessionData,
  generateIronSessionId,
  ironSessionAccountMiddlewareId,
  sessionOptions,
} from "@/auth/iron-session/lib";
import { AppRouteType } from "@/config/appRoutes";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";
import { temporaryAccountMiddlewareId } from "./utils/temporaryAccount";

const withIronSessionAccount: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // Ensure that the correct session options are used based on the request path
    const currentSessionOptions = sessionOptions[AppRouteType.Authenticated];

    if (!currentSessionOptions) {
      // If no session options are found for the current path, continue to the next middleware
      return nextMiddlewareHandler(request, event);
    }

    const response = await nextMiddlewareHandler(request, event);

    if (response instanceof NextResponse) {
      const session = await getIronSession<SessionData>(cookies(), currentSessionOptions);

      if (!session.isLoggedIn) {
        const providerAccountId = generateIronSessionId();

        const cookieOptions = {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          httpOnly: true, // Protect against XSS attacks
          secure: process.env.NODE_ENV !== "development", // Use secure cookies in production (requires HTTPS)
          sameSite: "strict" as const, // Helps against CSRF attacks, 'as const' ensures TypeScript treats it as a literal type
          path: "/", // Cookie will be accessible for the whole site
        };
        const accountIdToCreateHeader: string = `x-${temporaryAccountMiddlewareId}-create-id`.toLowerCase();

        response.cookies.set(currentSessionOptions.cookieName, providerAccountId, cookieOptions);
        response.headers.set(accountIdToCreateHeader, providerAccountId);

        // // const redirectTo = siteNavigation.antePlayground.href;
        // const redirectTo = siteNavigationUntyped.antePlayground.href;

        // if (request.nextUrl.pathname !== redirectTo) {
        //   return NextResponse.redirect(`${request.nextUrl.origin}${redirectTo}`, 302);
        // }
        // const providerAccountId = generateIronSessionId();
        // session.accountId = providerAccountId;
        // session.isLoggedIn = true;
        // await session.save();
        // revalidateAuthenticatedPaths();
      }
    } else {
      console.log(`withIronSessionAccount: response not instanceof NextResponse: typeof response=${typeof response}`);
    }
    // If the user is logged in, continue to the next middleware
    // return nextMiddlewareHandler(request, event);
  };
};

const ironSessionAccountMiddleware: MiddlewareEntry = {
  id: ironSessionAccountMiddlewareId,
  fn: withIronSessionAccount,
};

export default ironSessionAccountMiddleware;
