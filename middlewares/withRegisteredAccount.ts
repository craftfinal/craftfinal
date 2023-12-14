import { appRoutes } from "@/config/appRoutes";
import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";

const withRegisteredAccount: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const authMiddlewareImpl = authMiddleware({
      beforeAuth: (req, evt) => nextMiddlewareHandler(req, evt),
      publicRoutes: appRoutes.publicRoutes,
      ignoredRoutes: appRoutes.ignoredRoutes,
    });

    return await authMiddlewareImpl(request, event);
  };
};

const registeredAccountMiddleware: MiddlewareEntry = {
  id: "registeredaccount",
  fn: withRegisteredAccount,
  // disabled: true,
};

export default registeredAccountMiddleware;
