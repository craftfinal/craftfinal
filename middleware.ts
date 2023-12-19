// @/middleware.ts

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import executeMiddleware, { MiddlewareEntry } from "@/middlewares/executeMiddleware";
import pathnameMiddleware from "./middlewares/withPathnameAndSearchParams";
// import temporaryAccountMiddleware from "./middlewares/withTemporaryAccount";
// import registeredAccountMiddleware from "./middlewares/withRegisteredAccount";
import ironSessionAccountMiddleware from "./middlewares/withIronSessionAccount";

export const middlewares: Array<MiddlewareEntry> = [
  pathnameMiddleware,
  // temporaryAccountMiddleware,
  // registeredAccountMiddleware,
  ironSessionAccountMiddleware,
];

export default executeMiddleware(middlewares);
