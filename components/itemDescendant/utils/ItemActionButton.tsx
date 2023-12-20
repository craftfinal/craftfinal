// @/components/itemDescendant/utils/ItemActionButton.tsx

"use client";
import { getItemActionURLMap } from "@/components/chrome/navigation/breadcrumbs/ItemActionMenu";
import { ItemDescendantClientStateType } from "@/schemas/itemDescendant";
import { ResumeActionType, resumeActionButtonIcons } from "@/types/resume";
import Link from "next/link";
import { Button } from "../../ui/button";
import ItemDescendantListSynchronization from "./SyncButton";

export interface ItemActionButtonProps {
  pathname: string;
  item: ItemDescendantClientStateType;
  action?: ResumeActionType;
}
export function ItemActionButton(props: ItemActionButtonProps) {
  const { pathname, item, action = "view" } = props;
  if (!item.id) {
    return <ItemDescendantListSynchronization title="Save" />;
  }
  // const actionURL = getActionURL(pathname, item, action);
  const itemActionURLMap = getItemActionURLMap(pathname, item);
  // console.log(`ItemActionButton:getItemActionURLMap.availableActions.edit`, itemActionURLMap?.availableActions?.edit);
  const actionURL = itemActionURLMap?.availableActions.edit.url;
  const actionButtonInner = resumeActionButtonIcons[action];

  return actionURL ? (
    <Link href={actionURL}>
      <Button variant="ghost">{actionButtonInner}</Button>
    </Link>
  ) : null;
}
