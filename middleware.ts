// @/middleware.ts

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import executeMiddleware, { MiddlewareEntry } from "@/middlewares/executeMiddleware";
import withPathnameAndSearchParams from "@/middlewares/withPathnameAndSearchParams";
// import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import temporaryAccountMiddleware from "./middlewares/withTemporaryAccount";

export const middlewares: Array<MiddlewareEntry> = [
  withPathnameAndSearchParams,
  // registeredAccountMiddleware,
  temporaryAccountMiddleware,
];

export default executeMiddleware(middlewares);
