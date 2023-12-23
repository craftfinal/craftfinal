// @/hooks/useAutoSyncItemDescendantStore.tsx

"use client";

import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import { useEffect, useRef } from "react";

export enum StoreSyncStatus {
  Synced = "Synced", // No current sync operation
  Modified = "Modified",
  InProgress = "InProgress",
  Succeeded = "Succeeded",
  Failed = "Failed",
}

export function useSyncStatus() {
  const store = useItemDescendantStore(useStoreName());
  return store((state) => state.syncStatus);
}

export function useAutoSyncItemDescendantStore() {
  const store = useItemDescendantStore(useStoreName());
  const scheduleSyncWithServer = store((state) => state.scheduleSyncWithServer);

  const lastModified = store((state) => state.lastModified);
  const lastModifiedRef = useRef(lastModified);

  useEffect(() => {
    // Check if lastModified has changed and initiate sync if necessary
    if (lastModified === lastModifiedRef.current) {
      return;
    }
    lastModifiedRef.current = lastModified;
    scheduleSyncWithServer();

    return () => {
      // Cleanup logic if needed
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastModified]);
}

/*
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

  const autoSyncDelay = useAppSettingsStore((state) => state.autoSyncDelay);
  const autoSyncBackoffBase = useAppSettingsStore((state) => state.autoSyncBackoffBase);
  const autoSyncBackoffExponentScaleFactor = useAppSettingsStore((state) => state.autoSyncBackoffExponentScaleFactor);
  const autoSyncBackoffExponentMax = useAppSettingsStore((state) => state.autoSyncBackoffExponentMax);

  // Return sync status instead of setting it
  const [syncStatus, setSyncStatus] = useState<StoreSyncStatus>(StoreSyncStatus.Synced);
  const [numFailedAttempts, setNumFailedAttempts] = useState(0);

  if (!rootState) {
    throw Error(`sendItemDescendantToServer(): storeName=${storeName}, rootState=${rootState})`);
  }

  const syncItems = useCallback(async () => {
    let syncResult = StoreSyncStatus.Failed;
    try {
      setSyncStatus(StoreSyncStatus.InProgress);
      syncResult = await syncStoreWithServer(
        rootState,
        updateLastModifiedOfModifiedItems,
        updateStoreWithServerData,
      );
    } catch (error) {
      window.consoleLog(`useAutoSyncItemDescendantStore.syncItems: error`, error);
    }
    if (syncResult === StoreSyncStatus.Succeeded) {
      setSyncStatus(StoreSyncStatus.Succeeded);
      setTimeout(() => {
        setSyncStatus(StoreSyncStatus.Synced);
      }, syncStatusDisplayDuration);

      setNumFailedAttempts(0); // Reset failed attempts on success
      lastSyncTimeRef.current = new Date();
    } else {
      setSyncStatus(StoreSyncStatus.Failed);
      setNumFailedAttempts((prev) => prev + 1); // Increment failed attempts on failure
    }
    return syncResult;
  }, [rootState, updateLastModifiedOfModifiedItems, updateStoreWithServerData]);

  // Initial sync on component mount
  useEffect(() => {
    if (rootState.disposition !== ItemDisposition.Synced) {
      console.log(
        `useAutoSyncItemDescendantStore: set lastModifiedRef to epoch since rootState.disposition=${rootState.disposition}`,
      );
      lastModifiedRef.current = new Date(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncTimeoutRef.current]);

  useEffect(() => {
    // Only proceed if lastModified has actually changed
    if (lastModified === lastModifiedRef.current) {
      console.log(
        `useAutoSyncItemDescendantStore: lastModified=${dateToISOLocal(lastModified)} === ${dateToISOLocal(
          lastModifiedRef.current,
        )}=lastModifiedRef.current`,
      );
      return;
    }
    if (syncTimeoutRef.current) {
      console.log(
        `useAutoSyncItemDescendantStore.useEffect: ignore updated lastModified=${dateToISOLocal(
          lastModified,
        )} since syncTimeoutRef.current=${syncTimeoutRef.current}`,
      );
      return;
    }
    setSyncStatus(StoreSyncStatus.Modified);
    lastModifiedRef.current = lastModified;

    const now = new Date();
    let delay = 1000 * autoSyncDelay; // 1 second delay for synchronization

    // Adjust delay if last sync was less than `backoffInterval` ago
    if (lastSyncTimeRef.current) {
      const timeSinceLastSync = now.getTime() - lastSyncTimeRef.current.getTime();
      // Increase waiting period between attempts up to threshold
      const backoffInterval =
        1000 * autoSyncBackoffBase ** Math.min(autoSyncBackoffExponentScaleFactor * numFailedAttempts, autoSyncBackoffExponentMax);
      if (timeSinceLastSync < backoffInterval) {
        window.consoleLog(
          `useAutoSyncItemDescendantStore: ${numFailedAttempts} attempts failed in a row; wait for backoffInterval=${
            backoffInterval / 1000
          } seconds`,
        );
        delay = backoffInterval - timeSinceLastSync;
      }
    }

    // Cancel any existing timeout to avoid multiple syncs
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set timeout to perform sync
    syncTimeoutRef.current = setTimeout(() => {
      console.log(
        `useAutoSyncItemDescendantStore: executing sync and resetting syncTimeoutRef.current=${syncTimeoutRef.current} to null`,
      );
      syncTimeoutRef.current = null;
      syncItems();
    }, delay);
    console.log(
      `useAutoSyncItemDescendantStore: scheduled sync in ${delay / 1000}s for ${dateToISOLocal(
        new Date(now.getTime() + delay),
      )}: syncTimeoutRef.current=${syncTimeoutRef.current}`,
    );

    // Cleanup function
    return () => {
      console.log("useAutoSyncItemDescendantStore.useEfect: unmounting");
      if (syncTimeoutRef.current) {
        console.log("useAutoSyncItemDescendantStore.useEfect: clearing timeout", syncTimeoutRef.current);
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
        // lastModifiedRef.current = new Date(0);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastModified, numFailedAttempts, syncTimeoutRef.current]);
  return syncStatus;
}
*/
