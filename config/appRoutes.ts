// @/config/appRoutes.ts

export enum AppRouteType {
  Ignored = "ignoredRoutes",
  Public = "publicRoutes",
  Authenticated = "authenticatedRoutes",
}

export type AppRouteMapType = Record<AppRouteType, string[] | string>;

const contentRoutes = ["/(about|terms|privacy)(/.*)?"];
const marketingRoutes = ["/(product|use-cases)(/.*)?"];
const authenticatedRoutes = ["/(try|playground)(/.*)?"];

export const appRoutes: AppRouteMapType = {
  publicRoutes: [...authenticatedRoutes, ...marketingRoutes],
  authenticatedRoutes: authenticatedRoutes,
  ignoredRoutes: ["/", ...contentRoutes],
};

// Layouts that need to be revalidated when switching between
// authenticated and non-authenticated state
export const authenticatedRouteLayouts = ["/(authenticated"];
