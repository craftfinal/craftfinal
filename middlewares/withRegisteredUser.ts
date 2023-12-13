import { appRoutes } from "@/config/appRoutes";
import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";

const withRegisteredUser: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const authMiddlewareImpl = authMiddleware({
      beforeAuth: (req, evt) => nextMiddlewareHandler(req, evt),
      publicRoutes: appRoutes.publicRoutes,
      ignoredRoutes: appRoutes.ignoredRoutes,
    });

    return await authMiddlewareImpl(request, event);
  };
};

const registeredUserMiddleware: MiddlewareEntry = {
  id: "registereduser",
  fn: withRegisteredUser,
  // disabled: true,
};

export default registeredUserMiddleware;
