import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./executeMiddleware";

const withAuth: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const authMiddlewareImpl = authMiddleware({
      beforeAuth: (req, evt) => nextMiddlewareHandler(req, evt),
      publicRoutes: ["/(about|try|resume)(/.*)?"],
      ignoredRoutes: ["/", "/(legal)(/.*)?"],
    });

    return await authMiddlewareImpl(request, event);
  };
};
export default withAuth;
