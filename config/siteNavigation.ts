import { MainNavItem } from "@/types";
import { siteConfig } from "./site";

export interface MainNavItemWithMenuTitle extends MainNavItem {
  menuTitle: string;
}

export const siteNavigation: Record<string, MainNavItemWithMenuTitle> = {
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
  faq: {
    title: `Frequently asked questions (FAQ) ${siteConfig.name}`,
    menuTitle: `FAQ`,
    href: "/about/faq",
  },
  privacyPolicy: {
    title: `Privacy policy for ${siteConfig.name}`,
    menuTitle: `Privacy policy`,
    href: "/privacy",
  },
  termsOfUse: {
    title: `Terms of use for ${siteConfig.name}`,
    menuTitle: `Terms of use`,
    href: "/terms",
  },
  antePlayground: {
    title: `Enter the playground`,
    menuTitle: `Playground`,
    href: "/playground",
    authenticated: true,
  },
  inPlayground: {
    title: `Enter the playground`,
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

export const siteNavigationKeys = ["about", "faq"];
