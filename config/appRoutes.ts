export type AppRoutes = {
  publicRoutes: string[] | string;
  ignoredRoutes: string[] | string;
};

export const appRoutes = {
  publicRoutes: ["/(about|try|playground)(/.*)?"],
  ignoredRoutes: ["/", "/(terms|privacy|how-it-works|use-cases)(/.*)?"],
};
