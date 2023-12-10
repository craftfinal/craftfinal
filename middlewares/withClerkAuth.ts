import { appRoutes } from "@/config/appRoutes";
import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./executeMiddleware";

const withClerkAuth: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const authMiddlewareImpl = authMiddleware({
      beforeAuth: (req, evt) => nextMiddlewareHandler(req, evt),
      publicRoutes: appRoutes.publicRoutes,
      ignoredRoutes: appRoutes.ignoredRoutes,
    });

    return await authMiddlewareImpl(request, event);
  };
};
export default withClerkAuth;
