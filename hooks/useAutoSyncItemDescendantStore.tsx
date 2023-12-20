// @/hooks/useAutoSyncItemDescendantStore.tsx

"use client";

import { syncStatusDisplayDuration } from "@/components/itemDescendant/utils/SyncStatusIndicator";
import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { syncItemDescendantStoreWithServer } from "@/stores/itemDescendantStore/utils/syncItemDescendantStore";
import { useCallback, useEffect, useRef, useState } from "react";

export enum SyncStatus {
  Synced = "Synced", // No current sync operation
  Modified = "Modified",
  InProgress = "InProgress",
  Succeeded = "Succeeded",
  Failed = "Failed",
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

  const autoSyncDelay = useAppSettingsStore((state) => state.autoSyncDelay);
  const autoSyncBackoffBase = useAppSettingsStore((state) => state.autoSyncBackoffBase);
  const autoSyncBackoffExponent = useAppSettingsStore((state) => state.autoSyncBackoffExponent);
  const autoSyncBackoffExponentMax = useAppSettingsStore((state) => state.autoSyncBackoffExponentMax);

  // Return sync status instead of setting it
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.Synced);
  const [numFailedAttempts, setNumFailedAttempts] = useState(0);

  if (!rootState) {
    throw Error(`sendItemDescendantToServer(): storeName=${storeName}, rootState=${rootState})`);
  }

  const syncItems = useCallback(async () => {
    let syncResult = SyncStatus.Failed;
    try {
      setSyncStatus(SyncStatus.InProgress);
      syncResult = await syncItemDescendantStoreWithServer(
        rootState,
        updateLastModifiedOfModifiedItems,
        updateStoreWithServerData,
      );
    } catch (error) {
      window.consoleLog(`useAutoSyncItemDescendantStore.syncItems: error`, error);
    }
    if (syncResult === SyncStatus.Succeeded) {
      setSyncStatus(SyncStatus.Succeeded);
      setTimeout(() => {
        setSyncStatus(SyncStatus.Synced);
      }, syncStatusDisplayDuration);

      setNumFailedAttempts(0); // Reset failed attempts on success
      lastSyncTimeRef.current = new Date();
    } else {
      setSyncStatus(SyncStatus.Failed);
      setNumFailedAttempts((prev) => prev + 1); // Increment failed attempts on failure
    }
    return syncResult;
  }, [rootState, updateLastModifiedOfModifiedItems, updateStoreWithServerData]);

  // Initial sync on component mount
  // useEffect(() => {
  //   if (rootState.disposition !== ItemDisposition.Synced) {
  //     lastModifiedRef.current = new Date(0);
  //   }
  // }, []);

  useEffect(() => {
    // Only proceed if lastModified has actually changed
    if (lastModified === lastModifiedRef.current) {
      // console.log(
      //   `useAutoSyncItemDescendantStore: lastModified=${lastModified} === ${lastModifiedRef.current}=lastModifiedRef.current`,
      // );
      return;
    }
    setSyncStatus(SyncStatus.Modified);
    lastModifiedRef.current = lastModified;

    // Cancel any existing timeout to avoid multiple syncs
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    const now = new Date();
    let delay = 1000 * autoSyncDelay; // 1 second delay for synchronization

    // Adjust delay if last sync was less than `backoffInterval` ago
    if (lastSyncTimeRef.current) {
      const timeSinceLastSync = now.getTime() - lastSyncTimeRef.current.getTime();
      // Increase waiting period between attempts up to threshold
      const backoffInterval =
        1000 * autoSyncBackoffBase ** Math.min(autoSyncBackoffExponent * numFailedAttempts, autoSyncBackoffExponentMax);
      if (timeSinceLastSync < backoffInterval) {
        console.log(
          `useAutoSyncItemDescendantStore: ${numFailedAttempts} attempts failed in a row; wait for backoffInterval=${
            backoffInterval / 1000
          } seconds`,
        );
        delay = backoffInterval - timeSinceLastSync;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastModified, numFailedAttempts]); // Dependency on lastModified
  return syncStatus;
}
