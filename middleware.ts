// @/middleware.ts

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import executeMiddleware, { MiddlewareEntry } from "@/middlewares/executeMiddleware";
import withClerkAuth from "@/middlewares/withClerkAuth";
import withPathname from "@/middlewares/withPathname";
import withTemporaryAccount from "./middlewares/withTemporaryAccount";

const middlewares: Array<MiddlewareEntry> = [
  {
    id: "pathname",
    fn: withPathname,
    // disabled: true,
  },
  {
    id: "clerkauth",
    fn: withClerkAuth,
    // disabled: true,
  },
  {
    id: "temporaryaccount",
    fn: withTemporaryAccount,
    // disabled: true,
  },
];

export default executeMiddleware(middlewares);
