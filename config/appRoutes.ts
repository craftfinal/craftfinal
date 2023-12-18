// @/config/appRoutes.ts

export type AppRoutes = {
  publicRoutes: string[] | string;
  ignoredRoutes: string[] | string;
};

const contentRoutes = ["/(about|terms|privacy)(/.*)?"];
const marketingRoutes = ["/(product|use-cases)(/.*)?"];
const authenticatedRoutes = ["/(try|playground)(/.*)?"];
export const appRoutes = {
  publicRoutes: [...authenticatedRoutes, ...marketingRoutes],
  ignoredRoutes: ["/", ...contentRoutes],
};
