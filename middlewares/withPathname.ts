import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./executeMiddleware";

const withPathname: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    /** Add pathname and query string as additional headers
     * The objective of this hack is to make the pathname available for common use cases like
     * highlighting the active navigation item in server components without dynamic rendering
     */
    // https://nextjs.org/docs/pages/building-your-application/routing/middleware#setting-headers
    const response = await nextMiddlewareHandler(request, event);
    const pathname = request.nextUrl.pathname;
    const query = request.nextUrl.searchParams.toString();
    if (response) {
      const requestHeaders = new Headers(request.headers);

      // Add new request headers
      requestHeaders.set("x-pathname", pathname);
      requestHeaders.set("x-query", query);

      const nextResponse = NextResponse.next({
        request: {
          // New request headers
          headers: requestHeaders,
        },
      });
      return nextResponse;
    }

    return response;

    /** NOTE: This seems to work as well but does not call NextResponse.next(),
     * hence might lead to issues */
    /*
    const response = await nextMiddlewareHandler(request, event);
    if (response) {
      const pathname = request.nextUrl.pathname;
      response.headers.set("x-pathname", pathname);
      const query = request.nextUrl.searchParams.toString();
      response.headers.set("x-query", query);
      // console.log(`withPathname: pathname=${pathname}, requestHeaders: `, request.headers);
    }
    return response;
    */
  };
};

export default withPathname;
