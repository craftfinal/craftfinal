// @/components/itemDescendant/utils/AutoSyncStatusIndicator.tsx

"use client";

import { useAutoSyncItemDescendantStore } from "@/hooks/useAutoSyncItemDescendantStore";
// SyncIndicator.tsx
import SyncStatusIndicator from "./SyncStatusIndicator";

export function AutoSync() {
  // const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.None);
  // const storeName = useStoreName();
  // const store = useItemDescendantStore(storeName);
  // const lastModified = store((state) => state.lastModified);

  const syncStatus = useAutoSyncItemDescendantStore(); // Use the hook to get the current sync status

  return <SyncStatusIndicator syncStatus={syncStatus} />;
}
