import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./executeMiddleware";

const withPathname: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // Execute the next middleware in the chain and get its response
    const response = await nextMiddlewareHandler(request, event);

    if (response instanceof NextResponse) {
      // Extract pathname and query string from the request
      const pathname = request.nextUrl.pathname;
      const query = request.nextUrl.searchParams.toString();

      // Add the pathname and query string as headers to the response
      response.headers.set("x-pathname", pathname);
      response.headers.set("x-query", query);
    }

    // Return the modified response
    return response;
  };
};

export default withPathname;
