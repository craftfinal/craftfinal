import { MainNavItem } from "@/types";
import { siteConfig } from "./site";

export type AppNavigation = {
  home: MainNavItem;
  about: MainNavItem;
  termsOfUse: MainNavItem;
};

export const siteNavigation: AppNavigation = {
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
  termsOfUse: {
    title: `Terms of use for ${siteConfig.name}`,
    menuTitle: `Terms of use`,
    href: "/legal",
  },
};
