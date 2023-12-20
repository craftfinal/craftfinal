// @/components/itemDescendant/ItemDescendantListSyncButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import { useRef } from "react";

import { syncItemDescendantStoreWithServer } from "@/stores/itemDescendantStore/utils/syncItemDescendantStore";

export interface ItemDescendantListSyncButtonProps {
  title?: string;
}
export default function SyncButton(props: ItemDescendantListSyncButtonProps) {
  const synchronizeButtonRef = useRef<HTMLButtonElement>(null);

  const title = props.title ?? "Sync now";

  const storeName = useStoreName();
  const store = useItemDescendantStore(storeName);
  const rootState = store((state) => state);
  const parentId = store((state) => state.parentId);
  const updateLastModifiedOfModifiedItems = store((state) => state.updateLastModifiedOfModifiedItems);
  const updateStoreWithServerData = store((state) => state.updateStoreWithServerData);

  async function handleSynchronization(e: React.MouseEvent) {
    e.preventDefault();
    const forceUpdate = e.shiftKey;

    if (!rootState) {
      throw Error(`sendItemDescendantToServer(): storeName=${storeName}, rootState=${rootState})`);
    }
    await syncItemDescendantStoreWithServer(
      rootState,
      updateLastModifiedOfModifiedItems,
      updateStoreWithServerData,
      forceUpdate,
    );
  }

  return !store || !parentId ? null : (
    <div>
      <form
        className="bg-elem-light dark:bg-elem-dark-1 mt-8 flex items-center gap-x-3 rounded-md py-2"
        name="setSyncIntervalForm"
      >
        <Button onClick={handleSynchronization} ref={synchronizeButtonRef}>
          {title}
        </Button>
      </form>
    </div>
  );
}
