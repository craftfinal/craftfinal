// @/middleware.ts

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import executeMiddleware, { MiddlewareEntry } from "@/middlewares/executeMiddleware";
import pathnameMiddleware from "@/middlewares/withPathname";
import registeredUserMiddleware from "@/middlewares/withRegisteredUser";
import temporaryUserMiddleware from "./middlewares/withTemporaryUser";

const middlewares: Array<MiddlewareEntry> = [pathnameMiddleware, registeredUserMiddleware, temporaryUserMiddleware];

export default executeMiddleware(middlewares);
