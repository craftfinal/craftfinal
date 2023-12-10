"use client";

import { NavigationMenu, NavigationMenuLink } from "@/components/ui/navigation-menu";
// import Link from "next/link";
// import { appNavigation } from "@/config/appNavigation";
// import { siteConfig } from "@/config/site";
import { siteNavigation, siteNavigationKeys } from "@/config/siteNavigation";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
// import { NavigationMenuItemProps } from "@radix-ui/react-navigation-menu";
import React from "react";

// const components: { title: string; description: string }[] = [
//   {
//     title: "Harvard Resume",

//     description:
//       "Recommended template for employers in the US as well as management consulting elsewhere.",
//   },
//   {
//     title: "Executive CV",

//     description:
//       "A template with a one-pager followed by one or more cv pages. Suitable for executives and people with more than a decade of experience",
//   },
// ];

export function NavigationMenuBar() {
  return (
    <NavigationMenu>
      {siteNavigationKeys.map((key) => {
        const navItem = siteNavigation[key];
        return (
          <MainNavMenuItem key={key} navItem={navItem}>
            {navItem.menuTitle}
          </MainNavMenuItem>
        );
      })}

      {/*<NavigationMenuList className="space-x-2 sm:space-x-4 md:space-x-8">
          <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 sm:w-[24rem] md:w-[24rem] lg:w-[36rem] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">{siteConfig.name}</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      The last resume platform you will ever use.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href={siteNavigation.about.href} title="About">
                Learn about the basics of {siteConfig.name}.
              </ListItem>
              <ListItem href={appNavigation.tryApp.href} title="Try it yourself">
                Experience, how you can import and tailor a resume in 60 seconds with {siteConfig.name}
              </ListItem>
              <ListItem title="Community">Join the community and get help or support.</ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Templates</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className="font-medium">Documentation</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className="
              font-medium"
            >
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> 
      </NavigationMenuList>*/}
    </NavigationMenu>
  );
}

const MainNavMenuItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { navItem: MainNavItem }
>(({ navItem, className, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        href={navItem.href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className,
        )}
        title={navItem.title}
        {...props}
      >
        <p className="line-clamp-2 text-sm font-bold leading-none text-muted-foreground">
          {children ?? navItem.menuTitle ?? navItem.title}
        </p>
      </a>
    </NavigationMenuLink>
  );
});
MainNavMenuItem.displayName = "MainNavMenuItem";

/*
interface NavMenuItemProps extends NavigationMenuItemProps {
  navItem: MainNavItem;
}
function NavMenuItem({ navItem, ...props }: NavMenuItemProps) {
  return (
    <NavigationMenuItem {...props}>
      <NavigationMenuLink>
        <Link href={navItem.href}>{navItem.menuTitle}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
*/

/*
const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
*/
