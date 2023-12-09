export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// https://clerk.com/docs/references/nextjs/auth-middleware#making-pages-public-using-public-routes
/*
import { authMiddleware } from "@clerk/nextjs";
const clerkAuthMiddleware = authMiddleware({
  publicRoutes: ["/(try|resume)(/.*)?"],
  // "/", "/about" and "/legal" will be accessible to visitors without an account
  ignoredRoutes: ["/", "/(about|legal)(/.*)?"],
});
export default clerkAuthMiddleware;
*/

import executeMiddleware, { MiddlewareFactory } from "@/middlewares/executeMiddleware";
import withAuth from "@/middlewares/withAuth";
import withPathname from "@/middlewares/withPathname";

const auth = true;
const pathname = true;

const middlewares: Array<MiddlewareFactory> = [];
if (auth) {
  middlewares.push(withAuth);
}
if (pathname) {
  middlewares.push(withPathname);
}
export default executeMiddleware(middlewares);
