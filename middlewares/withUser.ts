import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./executeMiddleware";
import { appNavigation } from "@/config/appNavigation";

export const withUser: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;

    if (["/profile"]?.some((path) => pathname.startsWith(path))) {
      const userId = request.cookies.get("userId");
      if (!userId) {
        const url = new URL(appNavigation.signIn.href, request.url);
        return NextResponse.redirect(url);
      }
    }
    return nextMiddlewareHandler(request, event);
  };
};
