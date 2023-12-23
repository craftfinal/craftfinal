// @/components/itemDescendant/ItemDescendantListSyncButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import { useRef } from "react";

export interface ItemDescendantListSyncButtonProps {
  title?: string;
}
export default function SyncButton(props: ItemDescendantListSyncButtonProps) {
  const synchronizeButtonRef = useRef<HTMLButtonElement>(null);

  const title = props.title ?? "Sync now";

  const store = useItemDescendantStore(useStoreName());
  const syncWithServer = store((state) => state.syncWithServer);

  async function handleSynchronization(e: React.MouseEvent) {
    e.preventDefault();
    const forceUpdate = e.shiftKey;

    if (!store) {
      throw Error(`sendItemDescendantToServer(): store=${store})`);
    }
    syncWithServer(true, forceUpdate);
  }

  return !store ? null : (
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
