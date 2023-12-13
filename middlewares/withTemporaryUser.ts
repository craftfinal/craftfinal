import { getAuthProviderId } from "@/schemas/id";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";
import { getAuthProviderIdCookieName } from "./getAuthProviderIdCookieName";

const withTemporaryUser: MiddlewareFactory = (nextMiddlewareHandler) => {
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

const temporaryUserMiddleware: MiddlewareEntry = {
  id: "temporaryuser",
  fn: withTemporaryUser,
  // disabled: true,
};

export default temporaryUserMiddleware;
