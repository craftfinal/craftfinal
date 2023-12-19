import { SiteLogo } from "@/components/chrome/SiteLogo";
import { menuClassName } from "@/components/chrome/navigation/NavbarProps";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";
import { siteConfig } from "./site";

// Note: avoid defining the type of the siteNavigationUntyped object
// to let TypeScript infer it as restrictively as possible
// type SiteNavigationMapType = Record<string, NavItem>;
export const siteNavigationUntyped /*: SiteNavigationMapType */ = {
  home: {
    title: `${siteConfig.name}`,
    menuTitle: `Home`,
    href: "/",
  },
  about: {
    title: `About ${siteConfig.name}`,
    menuTitle: `About`,
    menuContent: `Learn more about ${siteConfig.name} and the people behind the product`,
    menuContentIcon: <SiteLogo />,
    href: "/about",
  },
  howItWorks: {
    title: `Our vision of how ${siteConfig.name} will revolutionize the creative process of crafting a pitch`,
    menuTitle: `Product`,
    href: "/product",
  },
  useCases: {
    title: `Use ${siteConfig.name} in consulting, strategy and research`,
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
  sourceRepo: {
    title: `GitHub repository`,
    menuTitle: `GitHub`,
    href: "https://github.com/craftfinal/craftfinal",
  },
};

// Infer SiteNavigationKeys from siteNavigation
export type SiteNavigationKeyType = keyof typeof siteNavigationUntyped;

export type MenuItemTypePredicateRenderFunctionType = {
  render: (/*key: string, ref: Ref<HTMLButtonElement>*/) => ReactNode;
  predicate(account: Base58CheckAccountOrNullOrUndefined, pathname: string): boolean;
};

export type MenuItemRenderFunctionType = () => ReactNode;
export type CustomMenuItemType = {
  item: SiteNavigationKeyType;
  render: MenuItemRenderFunctionType | Array<MenuItemTypePredicateRenderFunctionType>;
};

export type NavMenuItemWithChildrenType = {
  item: SiteNavigationKeyType;
  children: SiteNavigationKeyType[];
  render?: MenuItemRenderFunctionType | Array<MenuItemTypePredicateRenderFunctionType>;
};

// Now NavItemKeyType will be restricted to the actual keys of siteNavigation
export type NavMenuItemType = SiteNavigationKeyType | CustomMenuItemType | NavMenuItemWithChildrenType;

// Define a type that ensures all values in siteNavigation are of type NavItem
export type SiteNavigationMapType = Record<SiteNavigationKeyType, NavItem>;

// Now, siteNavigation can be typed as SiteNavigationMapType
export const siteNavigation: SiteNavigationMapType = siteNavigationUntyped;

export const mainNavigationKeys: NavMenuItemType[] = [
  { item: "howItWorks", children: ["useCases"] },
  { item: "about", children: ["privacyPolicy", "termsOfUse"] },
  {
    item: "antePlayground",
    render: [
      {
        render: (/*key: string, ref: Ref<HTMLAnchorElement>*/) => {
          return (
            <Button
              // key={key}
              variant="outline"
              className={cn(menuClassName.topLevel.container, menuClassName.topLevel.text)}
              // ref={ref}
            >
              <ArrowRightIcon />
              <span className="p-1" /> {siteNavigation.antePlayground.menuTitle}
            </Button>
          );
        },
        predicate: (account: Base58CheckAccountOrNullOrUndefined, pathname: string): boolean => {
          return !pathname.startsWith(siteNavigation.antePlayground.href);
        },
      } as MenuItemTypePredicateRenderFunctionType,
    ],
  },
];

/** This function is not yet in use
export function getNavItem(id: string): NavItem {
  const navItem = siteNavigation[id as NavItemKeyType];
  return { ...navItem, menuTitle: navItem.menuTitle ?? navItem.title };
}
 */
