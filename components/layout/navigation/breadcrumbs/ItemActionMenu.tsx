/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { sentenceCase } from "@/lib/utils/misc";
import { idRegex } from "@/schemas/id";
import { ItemDescendantClientStateType } from "@/schemas/itemDescendant";
import { ItemDescendantModelNameType, itemDescendantModelHierarchy } from "@/types/itemDescendant";
import { ResumeActionType, resumeActionTypes } from "@/types/resume";
import Link from "next/link";
import React, { ReactNode } from "react";

// Define a type for the action URL structure
type ActionURL = {
  title: string;
  url: string;
  active: boolean;
};

// Define a type where the keys are ResumeActionType and values are ActionURL objects
type ResumeActionsURLMap = {
  [K in ResumeActionType]: ActionURL;
};

interface ItemActionURLMap {
  model: ItemDescendantModelNameType;
  currentAction: ResumeActionType | undefined;
  availableActions: ResumeActionsURLMap;
}

export function getItemActionURLMap(
  pathname: string,
  item?: ItemDescendantClientStateType,
): ItemActionURLMap | undefined {
  // Define the regular expression with named groups
  const pathBaseURLRE = `(?<pathBaseURL>(?:/[^/]+)*?)`;
  const itemModelRE = `(?<pathItemModel>(?:` + itemDescendantModelHierarchy.join("|") + `))`;
  const itemIdRE = `(?<pathItemId>` + idRegex.substring(1, idRegex.length - 1) + `)`;
  const itemActionRE = `(?<pathItemAction>(?:` + resumeActionTypes.join("|") + `))`;

  // const extractRegExp = new RegExp(
  //   `^(?<pathBaseURL>.*?)(?:/(?<pathItemModel>${itemModelRE})/(?<pathItemId>${itemIdRE})(?:/(?<pathItemAction>${itemActionRE}))?)?`,
  // );

  const extractRE = `^` + pathBaseURLRE + `(?:/` + itemModelRE + `)?(?:/` + itemIdRE + `)?(?:/` + itemActionRE + `)?$`;
  const extractRegExp = new RegExp(extractRE);
  // Execute the regular expression
  const match = extractRegExp.exec(pathname);
  if (!match?.groups) {
    // window.consoleLog(`getItemActionURLMap: pathname`, pathname, `did not match`, extractRegExp.source);
    return undefined;
  }
  // Construct the URLs
  const { pathBaseURL } = match.groups;

  // If an item is passed in, we use it to define the path elements to construct the action path
  let itemModel = item?.itemModel,
    itemId = item?.id,
    currentAction: ResumeActionType | null = null;

  // Otherwise, the itemModel and itemId must be available in the pathname
  // Check if itemModel and itemId are available
  if (!itemModel || !itemId) {
    const { pathItemModel, pathItemId, pathItemAction } = match.groups;
    itemModel = pathItemModel as ItemDescendantModelNameType;
    itemId = pathItemId;
    currentAction = pathItemAction as ResumeActionType;

    // Check if itemModel and itemId are available
    if (!itemModel || !itemId) {
      return undefined;
    }
  }

  const actionBaseURL = `${pathBaseURL}/${itemModel}/${itemId}`;

  const viewActionURL = `${actionBaseURL}/view`;
  const editActionURL = `${actionBaseURL}/edit`;

  const itemActionURLMap = {
    model: itemModel as ItemDescendantModelNameType,
    id: itemId,
    currentAction: currentAction as ResumeActionType,
    availableActions: {
      view: { title: `View ${itemModel}`, url: viewActionURL, active: currentAction === "view" },
      edit: { title: `Edit ${itemModel}`, url: editActionURL, active: currentAction === "edit" },
    },
  };
  return itemActionURLMap;
}

export function getItemActionMenu(pathname: string, title?: string) {
  const actionURLMap = getItemActionURLMap(pathname);
  if (!actionURLMap) return actionURLMap;

  const itemModel = actionURLMap.model;

  // Construct the menu title unless it has been passed as an argument
  const menuTitle = title ?? sentenceCase(`${itemModel} actions`);

  // Construct and return the object with URLs
  return {
    menuTitle,
    actions: actionURLMap.availableActions,
  };
}

export default function ItemActionMenu(pathname: string, title?: string): ReactNode {
  // Render an action menu if and only if we are already on a specific item
  const itemActions = getItemActionMenu(pathname, title);
  if (!itemActions) return null;

  return (
    <NavigationMenu className="z-5">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{itemActions.menuTitle}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-max flex-col">
              {Object.entries(itemActions.actions).map(([actionKey, action]) => {
                return (
                  <ItemActionMenuListItem
                    key={actionKey}
                    href={action.url}
                    active={action.active}
                    title={sentenceCase(actionKey)}
                  >
                    {action.title}
                  </ItemActionMenuListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ItemActionMenuListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { active: boolean }
>(({ className, href, title, children, active, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild active={active}>
        <Link
          href={href ?? "#"}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
            {
              "bg-accent bg-opacity-50": active, // Apply additional styles if active
            },
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ItemActionMenuListItem.displayName = "ListItem";
