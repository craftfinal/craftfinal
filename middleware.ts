// @/middleware.ts

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import executeMiddleware, { MiddlewareEntry } from "@/middlewares/executeMiddleware";
import pathnameMiddleware from "@/middlewares/withPathname";
import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import temporaryAccountMiddleware from "./middlewares/withTemporaryAccount";

const middlewares: Array<MiddlewareEntry> = [
  pathnameMiddleware,
  registeredAccountMiddleware,
  temporaryAccountMiddleware,
];

export default executeMiddleware(middlewares);
