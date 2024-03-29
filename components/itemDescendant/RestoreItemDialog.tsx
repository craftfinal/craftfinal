// @/components/itemDescendant/ItemDescendantItem.tsx

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { ItemDescendantClientStateType } from "@/schemas/itemDescendant";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { ItemDescendantRenderProps } from "./ItemDescendantList.client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { formatRelative } from "date-fns";
import { useState } from "react";

export interface ItemProps extends ItemDescendantRenderProps {
  rootItemModel: ItemDescendantModelNameType;
  itemModel: ItemDescendantModelNameType;
  item: ItemDescendantClientStateType;
}
export default function Item(props: ItemProps) {
  const { item } = props;
  // const [editingInput, setEditingInput] = useState(resumeAction === "edit");
  const store = useCurrentItemDescendantStore();
  const restoreDeletedItem = store((state) => state.restoreDeletedItem);

  const [open, setOpen] = useState(!!item.deletedAt);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore resume?</DialogTitle>
          <DialogDescription>
            You can still restore the resume that was deleted {formatRelative(item.deletedAt!, new Date())}.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => restoreDeletedItem()}>Restore resume</Button>
      </DialogContent>
    </Dialog>
  );
}
