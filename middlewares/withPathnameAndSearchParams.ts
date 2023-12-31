// @/middlewares/withPathnameAndSearchParams.ts

import { pathnameAndSearchParamsHeaderName } from "@/middlewares/utils/pathnameAndSearchParams";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareEntry, MiddlewareFactory } from "./executeMiddleware";

const withPathnameAndSearchParams: MiddlewareFactory = (nextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // Execute the next middleware in the chain and get its response
    const response = await nextMiddlewareHandler(request, event);

    if (response instanceof NextResponse) {
      // Extract pathname and query string from the request
      const pathname = request.nextUrl.pathname;
      const query = request.nextUrl.searchParams.toString();

      // Add the pathname and query string as headers to the response
      response.headers.set(pathnameAndSearchParamsHeaderName.pathname, pathname);
      response.headers.set(pathnameAndSearchParamsHeaderName.searchParams, query);
    }

    // Return the modified response
    return response;
  };
};

const pathnameMiddleware: MiddlewareEntry = {
  id: "pathnameandsearchparams",
  fn: withPathnameAndSearchParams,
  // disabled: true,
};

export default pathnameMiddleware;
