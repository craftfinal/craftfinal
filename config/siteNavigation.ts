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
    href: "/faq",
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
  tryApp: {
    title: `Try ${siteConfig.name}`,
    menuTitle: `Try`,
    href: "/try",
  },
  enterApp: {
    title: `Enter ${siteConfig.name}`,
    menuTitle: `Enter`,
    href: "/resume",
  },
  signUp: {
    title: `Sign up`,
    menuTitle: `Sign up`,
    href: "/sign-up",
  },
  afterSignUp: {
    title: `You have signed up for ${siteConfig.name}`,
    menuTitle: `After Sign Up`,
    href: "/sign-up",
  },
  signIn: {
    title: `Sign in`,
    menuTitle: `Sign in`,
    href: "/sign-in",
  },
  afterSignIn: {
    title: `You have signed in to ${siteConfig.name}`,
    menuTitle: `After Sign In`,
    href: "/sign-in",
  },
  signOut: {
    title: `Sign out`,
    menuTitle: `Sign out`,
    href: "/sign-out",
  },
  afterSignOut: {
    title: `You have signed out of ${siteConfig.name}`,
    menuTitle: `After Sign Out`,
    href: "/sign-out",
  },
  userProfile: {
    title: `Settings and profile`,
    menuTitle: `Profile`,
    href: "/user-profile",
  },
};

export const siteNavigationKeys = ["about", "faq"];
