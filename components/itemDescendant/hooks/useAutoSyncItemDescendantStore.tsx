// @/hooks/useAutoSyncItemDescendantStore.tsx

"use client";

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useEffect, useRef, useState } from "react";
import { useIsOnline } from "../../../hooks/useIsOnline";

export enum StoreSyncStatus {
  Synced = "Synced", // No current sync operation
  Modified = "Modified",
  InProgress = "InProgress",
  Succeeded = "Succeeded",
  Failed = "Failed",
}

export function useSyncStatus() {
  const store = useCurrentItemDescendantStore();
  return store((state) => state.syncStatus);
}

export function useAutoSyncItemDescendantStore() {
  const { isOnline /*, isOffline, error */ } = useIsOnline();
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  const store = useCurrentItemDescendantStore();
  const scheduleSyncWithServer = store((state) => state.scheduleSyncWithServer);
  const resetSyncScheduler = store((state) => state.resetSyncScheduler);

  const lastModified = store((state) => state.lastModified);
  const lastModifiedRef = useRef(lastModified);

  useEffect(() => {
    // Check if lastModified has changed and initiate sync if necessary
    if (lastModified === lastModifiedRef.current) {
      return;
    }
    lastModifiedRef.current = lastModified;
    if (isOnline) {
      setLastOnline(new Date());
      if (lastOnline === null) {
        console.log(`useAutoSyncItemDescendantStore: still online: scheduling sync`);
        scheduleSyncWithServer();
      } else {
        console.log(`useAutoSyncItemDescendantStore: now online again: reset sync scheduler and schedule sync`);
        resetSyncScheduler();
        scheduleSyncWithServer();
      }
    } else {
      console.log(`useAutoSyncItemDescendantStore: offline: not scheduling sync`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastModified]);
}
