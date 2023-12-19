// @/hooks/useAutoSyncItemDescendantStore.tsx

"use client";

import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import { syncItemDescendantStoreWithServer } from "@/stores/itemDescendantStore/utils/syncItemDescendantStore";
import { useCallback, useEffect, useRef, useState } from "react";

export enum SyncStatus {
  Imminent = "Imminent",
  InProgress = "InProgress",
  Succeeded = "Succeeded",
  None = "None", // No current sync operation
}

export function useAutoSyncItemDescendantStore() {
  const storeName = useStoreName();
  const store = useItemDescendantStore(storeName);
  const rootState = store((state) => state);
  const updateLastModifiedOfModifiedItems = store((state) => state.updateLastModifiedOfModifiedItems);
  const updateStoreWithServerData = store((state) => state.updateStoreWithServerData);

  const lastModified = store((state) => state.lastModified);

  const lastModifiedRef = useRef(lastModified);
  const lastSyncTimeRef = useRef<Date | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Return sync status instead of setting it
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.None);

  if (!rootState) {
    throw Error(`sendItemDescendantToServer(): storeName=${storeName}, rootState=${rootState})`);
  }

  const forceUpdate = false;

  const syncItems = useCallback(() => {
    async function executeSync() {
      setSyncStatus(SyncStatus.InProgress);
      await syncItemDescendantStoreWithServer(
        rootState,
        updateLastModifiedOfModifiedItems,
        updateStoreWithServerData,
        forceUpdate,
      );
      setSyncStatus(SyncStatus.Succeeded);
    }
    executeSync();
    lastSyncTimeRef.current = new Date();
  }, [forceUpdate, rootState, updateLastModifiedOfModifiedItems, updateStoreWithServerData]);

  useEffect(() => {
    // Only proceed if lastModified has actually changed
    if (lastModified === lastModifiedRef.current) {
      // console.log(
      //   `useAutoSyncItemDescendantStore: lastModified=${lastModified} === ${lastModifiedRef.current}=lastModifiedRef.current`,
      // );
      return;
    }
    setSyncStatus(SyncStatus.Imminent);
    lastModifiedRef.current = lastModified;

    // Cancel any existing timeout to avoid multiple syncs
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    const now = new Date();
    let delay = 1000; // 1 second delay for synchronization

    // Adjust delay if last sync was less than 2 seconds ago
    if (lastSyncTimeRef.current) {
      const timeSinceLastSync = now.getTime() - lastSyncTimeRef.current.getTime();
      if (timeSinceLastSync < 2000) {
        // 2 seconds threshold
        delay = 2000 - timeSinceLastSync;
      }
    }

    // Set timeout to perform sync
    syncTimeoutRef.current = setTimeout(syncItems, delay);

    // Cleanup function
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [lastModified]); // Dependency on lastModified
  return syncStatus;
}