"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NestedMenuKeyType, SubMenuKeyType, mainNavigationKeys, siteNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import Link from "next/link";
import React from "react";
import { menuClassName } from "./Navbar";

export function NavigationMenuBar() {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8">
        {mainNavigationKeys.map((key) => {
          if (typeof key === "string") {
            const navItem = siteNavigation[key];
            return (
              <MainNavMenuItem key={key} navItem={navItem}>
                {navItem.menuTitle}
              </MainNavMenuItem>
            );
          } else {
            return <MainNavMenuWithChildrenItem key={key.item} keyWithChildren={key} />;
          }
        })}

        {/* <NavigationMenuItem>
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
              <ListItem href={siteNavigation.tryApp.href} title="Try it yourself">
                Experience, how you can import and tailor a resume in 60 seconds with {siteConfig.name}
              </ListItem>
              <ListItem title="Community">Join the community and get help or support.</ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        {/* <NavigationMenuItem>
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
        </NavigationMenuItem> */}
        {/* <NavigationMenuItem>
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
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const MainNavMenuWithChildrenItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { keyWithChildren: NestedMenuKeyType }
>(({ keyWithChildren, ...props }, ref) => {
  const nestedItem = keyWithChildren as SubMenuKeyType;
  const navItem = siteNavigation[nestedItem.item];
  const subItems = [nestedItem.item, ...nestedItem.children];
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "bg-transparent",
          menuClassName.item.container,
          menuClassName.item.text,
          menuClassName.topLevel.text,
          menuClassName.topLevel.textColor,
          menuClassName.topLevel.container,
        )}
      >
        {navItem.menuTitle}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[16rem] gap-3 p-3 sm:w-[24rem] md:w-[24rem] md:p-4 lg:w-[36rem] lg:grid-cols-[.75fr_1fr] lg:p-6">
          {subItems.map((subKey, index) => {
            const navItem = siteNavigation[subKey];
            return (
              <SubMenuItem key={navItem.menuTitle} index={index} navItem={navItem} {...props} ref={ref}>
                {navItem.menuContent ?? navItem.title}
              </SubMenuItem>
            );
          })}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
});
MainNavMenuWithChildrenItem.displayName = "MainNavMenuWithChildrenItem";

const MainNavMenuItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { navItem: MainNavItem }
>(({ navItem, children, ...props }, ref) => {
  return (
    <NavigationMenuItem>
      <Link
        legacyBehavior
        passHref
        ref={ref}
        href={navItem.href}
        prefetch={navItem?.authenticated ? false : undefined}
        title={navItem.title}
        {...props}
      >
        <NavigationMenuLink>
          <p
            className={cn(
              menuClassName.item.container,
              menuClassName.item.text,
              menuClassName.topLevel.text,
              menuClassName.topLevel.textColor,
              menuClassName.topLevel.container,
              "flex items-center hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              // "hover:line-clamp-2", // overrides `display: flex`
            )}
          >
            {children ?? navItem.menuTitle ?? navItem.title}
          </p>
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
});
MainNavMenuItem.displayName = "MainNavMenuItem";

const SubMenuItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { index?: number; navItem: MainNavItem }
>(({ navItem, index = 1, children, className, ...props }, ref) => {
  return (
    <li className={cn({ "row-span-3": index === 0 })}>
      <NavigationMenuLink asChild>
        <Link
          href={navItem.href}
          ref={ref}
          className={cn(
            menuClassName.item.container,
            menuClassName.item.text,
            menuClassName.subItem.container,
            "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            {
              "flex h-full w-full flex-col justify-end bg-gradient-to-b from-muted/50 to-muted focus:shadow-md":
                index === 0,
              "block space-y-1 leading-none": index > 0,
            },
            className,
          )}
          {...props}
        >
          <div
            className={cn("font-medium sm:text-base md:text-lg", {
              "mb-2 mt-4 text-lg": index === 0,
              "text-sm leading-none": index > 0,
            })}
          >
            {navItem.menuTitle}
          </div>
          <p
            className={cn("text-sm leading-tight text-muted-foreground", {
              "": index === 0,
              "line-clamp-2": index > 0,
            })}
          >
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
SubMenuItem.displayName = "SubMenuItem";

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
