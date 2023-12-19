"use client";

import { useTemporaryAccount } from "@/auth/TemporaryAccountProvider";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  CustomMenuItemType,
  NavMenuItemWithChildrenType,
  SiteNavigationKeyType,
  mainNavigationKeys,
  siteNavigation,
} from "@/config/navigation";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { NavbarProps, menuClassName } from "./NavbarProps";

interface NavigationMenuBarProps extends NavbarProps {}
export function NavigationMenuBar({ className }: NavigationMenuBarProps) {
  // init disable state
  const [menuTriggerOnClickEnabled, setMenuTriggerOnClickEnabled] = useState(true);

  // init reference array
  const targetRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Create observer on first render
  useEffect(() => {
    // Callback function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const observerCallback = (mutationsList: any) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state" &&
          mutation.target.dataset.state === "open"
        ) {
          setMenuTriggerOnClickEnabled(false);
          const timeout = setTimeout(() => {
            setMenuTriggerOnClickEnabled(true);
            clearTimeout(timeout);
          }, 2000);
        }
      }
    };

    // Init MutationObserver
    const observer = new MutationObserver(observerCallback);

    // Add ref nodes to observer watch
    targetRef.current.forEach((element) => {
      if (element) {
        observer.observe(element, {
          attributes: true,
        });
      }
    });

    // Disconnect on dismount
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {mainNavigationKeys.map((key) => {
          if (typeof key === "string") {
            const navItem = siteNavigation[key];
            return (
              <MainNavMenuItem key={key} navItem={navItem}>
                {navItem.menuTitle}
              </MainNavMenuItem>
            );
          } else if ("children" in key) {
            // We need to distinguish whether it's simply a custom navigation item,
            // which we can render as a HTMLAnchorElement, or an item with sub items,
            // which requires state and is rendered as a button by RadixUI
            const navItemWithChildrenProps: MainNavMenuItemWithChildrenType = {
              navItemWithChildren: key,
              // account,
              // pathname,
              targetRef,
              menuTriggerOnClickEnabled,
            };
            return <MainNavMenuItemWithChildren key={key.item} navItemWithChildrenProps={navItemWithChildrenProps} />;
          } else {
            return <MainNavCustomItem key={key.item} customItem={key} />;
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type MainNavCustomItemType = {
  customItem: CustomMenuItemType;
  account: Base58CheckAccountOrNullOrUndefined;
  pathname: string;
};
const MainNavCustomItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { customItem: CustomMenuItemType }
>(({ customItem, ...props }, ref) => {
  const pathname = usePathname();
  const account = useTemporaryAccount();

  return <NavigationMenuItem>{renderCustomMenuItem({ customItem, pathname, account }, props, ref)}</NavigationMenuItem>;
});
MainNavCustomItem.displayName = "MainNavCustomItem";

function renderCustomMenuItem(
  customItemProps: MainNavCustomItemType,
  anchorProps: React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<React.ElementRef<"a">>,
): ReactNode {
  const { customItem, account, pathname } = customItemProps;
  const navItem = siteNavigation[customItem.item];
  if (typeof customItem?.render === "function") {
    const menuItemRenderFunction = customItem.render as () => ReactNode;
    return (
      <Suspense fallback={<button>loading</button>}>
        <Link legacyBehavior passHref href={navItem.href} ref={ref} key={navItem.href} {...anchorProps}>
          {menuItemRenderFunction()}
        </Link>
      </Suspense>
    );
  } else if (typeof customItem?.render === "object") {
    const menuItemPredicateArray = customItem.render;
    return menuItemPredicateArray.map((item) => {
      const menuItemRenderFunction = item.render as () => ReactNode;
      return (
        item.predicate(account, pathname) && (
          <Suspense fallback={<button>loading</button>} key={navItem.href}>
            <Link legacyBehavior passHref href={navItem.href} ref={ref} key={navItem.href} {...anchorProps}>
              {menuItemRenderFunction()}
            </Link>
          </Suspense>
        )
      );
    });
  }
  return null;
}

type MainNavMenuItemWithChildrenType = {
  navItemWithChildren: NavMenuItemWithChildrenType;
  targetRef: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  menuTriggerOnClickEnabled: boolean;
  // account: Base58CheckAccountOrNullOrUndefined;
  // pathname: string;
};

const MainNavMenuItemWithChildren = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithRef<"button"> & { navItemWithChildrenProps: MainNavMenuItemWithChildrenType }
>(({ navItemWithChildrenProps, ...buttonProps }, ref) => {
  const { navItemWithChildren, targetRef, menuTriggerOnClickEnabled } = navItemWithChildrenProps;
  const navItem = siteNavigation[navItemWithChildren.item];
  const subItems = [navItemWithChildren.item, ...navItemWithChildrenProps.navItemWithChildren.children];

  return (
    <NavigationMenuItem>
      <>
        <NavigationMenuTrigger
          // Add element to `targetRef` array for MutationObserver //////////////
          ref={(elementRef) => {
            targetRef.current.push(elementRef);
            return ref;
          }}
          // Prevent clicks if not enabled /////////////////////////////////////?
          onClick={(e) => {
            if (!menuTriggerOnClickEnabled) {
              // console.log(`MainNavMenuItemWithChildren: preventDefault`);
              e.preventDefault();
            }
          }}
          className={cn(
            "bg-transparent",
            menuClassName.item.container,
            menuClassName.item.text,
            menuClassName.topLevel.text,
            menuClassName.topLevel.textColor,
            menuClassName.topLevel.container,
          )}
          {...buttonProps}
        >
          {navItem.menuTitle}
        </NavigationMenuTrigger>
        {renderMainNavChildrenContent(subItems, {})}
      </>
    </NavigationMenuItem>
  );
});
MainNavMenuItemWithChildren.displayName = "MainNavMenuItemWithChildren";

function renderMainNavChildrenContent(
  subItems: Array<SiteNavigationKeyType>,
  subItemProps: React.ComponentPropsWithoutRef<"a">,
): ReactNode {
  return (
    <NavigationMenuContent>
      {subItems && (
        <ul className="grid gap-2 p-0 sm:p-2 md:w-[24rem] md:gap-4 md:p-3 lg:w-[36rem] lg:grid-cols-[.75fr_1fr]">
          {subItems.map((subKey, index) => {
            const navItem = siteNavigation[subKey];
            return (
              <SubMenuItem
                key={navItem.title}
                index={index}
                navItem={navItem}
                numItems={subItems.length}
                {...subItemProps}
              >
                {navItem.menuContent ?? navItem.title}
              </SubMenuItem>
            );
          })}
        </ul>
      )}
    </NavigationMenuContent>
  );
}

const MainNavMenuItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { navItem: NavItem }
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
  React.ComponentPropsWithoutRef<"a"> & { index?: number; numItems: number; navItem: NavItem }
>(({ navItem, index = 1, numItems, children, className, ...props }, ref) => {
  return (
    <li
      className={cn({
        "row-span-1": index === 0 && numItems <= 2,
        "row-span-2": index === 0 && numItems === 3,
        "row-span-3": index === 0 && numItems === 4,
        "row-span-4": index === 0 && numItems === 5,
        "row-span-5": index === 0 && numItems === 6,
      })}
    >
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
              "flex flex-col gap-2 md:gap-4": navItem.menuContentIcon,
            })}
          >
            {navItem.menuContentIcon ?? null}
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
  navItem: NavItem;
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

/* <NavigationMenuItem>
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
        </NavigationMenuItem> */

/* <NavigationMenuItem>
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
        </NavigationMenuItem> */

/* <NavigationMenuItem>
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
        </NavigationMenuItem> */
