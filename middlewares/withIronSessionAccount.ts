// @/middlewares/withIronSessionAccount.ts

import {
  SessionData,
  generateIronSessionId,
  ironSessionAccountMiddlewareId,
  sessionOptions,
} from "@/auth/iron-session/lib";
import { AppRouteType } from "@/config/appRoutes";
import { temporaryAccountMiddlewareId } from "@/middlewares/utils/temporaryAccount";
import { getIronSession } from "iron-session";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";
import { cookies } from "next/headers";

export const accountIdToCreateHeader: string = `x-${temporaryAccountMiddlewareId}-create-id`.toLowerCase();

const withIronSessionAccount: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = await nextMiddlewareHandler(request, event);

    if (response instanceof NextResponse) {
      // Ensure that the correct session options are used based on the request path
      const currentSessionOptions = sessionOptions[AppRouteType.Authenticated];

      const session = await getIronSession<SessionData>(cookies(), currentSessionOptions);

      if (!session.isLoggedIn) {
        const providerAccountId = generateIronSessionId();
        const newSession = await getIronSession<SessionData>(response.cookies, currentSessionOptions);
        newSession.accountId = providerAccountId;
        newSession.isLoggedIn = true;
        await newSession.save();
        // revalidateAuthenticatedPaths();
        console.log(`withIronSessionAccount: saved session:`, newSession);
      }
    } else {
      console.log(`withIronSessionAccount: response not instanceof NextResponse: typeof response=${typeof response}`);
    }
    return response;
  };
};

const ironSessionAccountMiddleware: MiddlewareEntry = {
  // FIXME: temporaryAccountMiddlewareId had to be defined externally to avoid circular dependencies
  id: ironSessionAccountMiddlewareId,
  fn: withIronSessionAccount,
  // disabled: true,
};
export default ironSessionAccountMiddleware;
