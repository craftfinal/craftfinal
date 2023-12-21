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

export const accountIdToCreateHeader: string = `x-${ironSessionAccountMiddlewareId}-create-id`.toLowerCase();

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
  id: ironSessionAccountMiddlewareId,
  fn: withIronSessionAccount,
  // disabled: true,
};
export default ironSessionAccountMiddleware;
