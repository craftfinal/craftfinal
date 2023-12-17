// @/components/itemDescendant/utils/AutoSyncStatusIndicator.tsx

"use client";

import { SyncStatus, useAutoSyncItemDescendantStore } from "@/hooks/useAutoSyncItemDescendantStore";
// SyncIndicator.tsx
import { useEffect, useState } from "react";
import SyncStatusIndicator from "./SyncStatusIndicator";
import { useStoreName } from "@/contexts/StoreNameContext";
import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";

export function AutoSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.None);
  const storeName = useStoreName();
  const store = useItemDescendantStore(storeName);
  const lastModified = store((state) => state.lastModified);

  useAutoSyncItemDescendantStore();

  useEffect(() => {
    // Example logic for changing sync status
    setSyncStatus(SyncStatus.Imminent);

    // Simulate the start of sync
    setTimeout(() => {
      setSyncStatus(SyncStatus.InProgress);

      // Simulate the end of sync
      setTimeout(() => {
        setSyncStatus(SyncStatus.Succeeded);

        // Reset sync status after a while
        setTimeout(() => {
          setSyncStatus(SyncStatus.None);
        }, 2000); // Reset after 2 seconds
      }, 3000); // Sync ends after 3 seconds
    }, 1000); // Sync starts after 1 second
  }, [lastModified]);

  return <SyncStatusIndicator syncStatus={syncStatus} />;
}
