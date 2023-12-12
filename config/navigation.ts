import { MainNavItem } from "@/types";
import { siteConfig } from "./site";

// Note: avoid defining the type of the siteNavigationUntyped object
// to let TypeScript infer it as restrictively as possible
// type SiteNavigationMapType = Record<string, MainNavItem>;
const siteNavigationUntyped /*: SiteNavigationMapType */ = {
  home: {
    title: `${siteConfig.name}`,
    menuTitle: `Home`,
    href: "/",
  },
  about: {
    title: `About ${siteConfig.name}`,
    menuTitle: `About`,
    href: "/about",
  },
  howItWorks: {
    title: `How ${siteConfig.name} works`,
    menuTitle: `How it works`,
    href: "/technology",
  },
  useCases: {
    title: `Key use cases of ${siteConfig.name}`,
    menuTitle: `Use cases`,
    href: "/use-cases",
  },
  faq: {
    title: `Frequently asked questions (FAQ) ${siteConfig.name}`,
    menuTitle: `FAQ`,
    href: "/about/faq",
  },
  privacyPolicy: {
    title: `Privacy policy for ${siteConfig.name}`,
    menuTitle: `Privacy policy`,
    menuContent: `Learn how we safeguard your privacy at ${siteConfig.name}`,
    href: "/privacy",
  },
  termsOfUse: {
    title: `Terms of use for ${siteConfig.name}`,
    menuTitle: `Terms of use`,
    menuContent: `Our terms for using ${siteConfig.name}`,
    href: "/terms",
  },
  antePlayground: {
    title: `Enter the playground`,
    menuTitle: `Playground`,
    href: "/playground",
    authenticated: true,
  },
  inPlayground: {
    title: `Playground`,
    menuTitle: `Playground`,
    href: "/playground/resume",
    authenticated: true,
  },
  tryApp: {
    title: `Try ${siteConfig.name}`,
    menuTitle: `Try`,
    href: "/try",
    authenticated: true,
  },
  enterApp: {
    title: `Enter ${siteConfig.name}`,
    menuTitle: `Enter`,
    href: "/app",
    authenticated: true,
  },
  signUp: {
    title: `Sign up`,
    menuTitle: `Sign up`,
    href: "/sign-up",
    authenticated: true,
  },
  afterSignUp: {
    title: `You have signed up for ${siteConfig.name}`,
    menuTitle: `After Sign Up`,
    href: "/playground",
    authenticated: true,
  },
  signIn: {
    title: `Sign in`,
    menuTitle: `Sign in`,
    href: "/sign-in",
    authenticated: true,
  },
  afterSignIn: {
    title: `You have signed in to ${siteConfig.name}`,
    menuTitle: `After Sign In`,
    href: "/playground",
    authenticated: true,
  },
  signOut: {
    title: `Sign out`,
    menuTitle: `Sign out`,
    href: "/sign-out",
    authenticated: true,
  },
  afterSignOut: {
    title: `You have signed out of ${siteConfig.name}`,
    menuTitle: `After Sign Out`,
    href: "/",
  },
  userProfile: {
    title: `Settings and profile`,
    menuTitle: `Profile`,
    href: "/user-profile",
    authenticated: true,
  },
  itemRoot: {
    title: `Item root`,
    menuTitle: `Item`,
    href: "/item",
    authenticated: true,
  },
};

// Infer SiteNavigationKeys from siteNavigation
export type SiteNavigationKeyType = keyof typeof siteNavigationUntyped;

export type SubMenuKeyType = { item: SiteNavigationKeyType; children: SiteNavigationKeyType[] };

// Now NavItemKeyType will be restricted to the actual keys of siteNavigation
export type NestedMenuKeyType = SiteNavigationKeyType | SubMenuKeyType;

// Define a type that ensures all values in siteNavigation are of type MainNavItem
export type SiteNavigationMapType = Record<SiteNavigationKeyType, MainNavItem>;

// Now, siteNavigation can be typed as SiteNavigationMapType
export const siteNavigation: SiteNavigationMapType = siteNavigationUntyped;

export const mainNavigationKeys: NestedMenuKeyType[] = [
  "howItWorks",
  "useCases",
  { item: "about", children: ["privacyPolicy", "termsOfUse"] },
];

/** This function is not yet in use
export function getNavItem(id: string): MainNavItem {
  const navItem = siteNavigation[id as NavItemKeyType];
  return { ...navItem, menuTitle: navItem.menuTitle ?? navItem.title };
}
 */
