// @/components/itemDescendant/utils/AutoSyncStatusIndicator.tsx

"use client";

import { useAutoSyncItemDescendantStore } from "@/hooks/useAutoSyncItemDescendantStore";
import SyncStatusIndicator from "./SyncStatusIndicator";
// import { Suspense } from "react";
// import ErrorBoundary from "@/app/(authenticated)/playground/ErrorBoundary";

export function AutoSync() {
  // const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.None);
  // const storeName = useStoreName();
  // const store = useItemDescendantStore(storeName);
  // const lastModified = store((state) => state.lastModified);

  const syncStatus = useAutoSyncItemDescendantStore(); // Use the hook to get the current sync status

  return (
    // <Suspense fallback="Offline">
    //   <ErrorBoundary fallback={<div>ErrorBoundary</div>}>
    <SyncStatusIndicator syncStatus={syncStatus} />
    //   </ErrorBoundary>
    // </Suspense>
  );
}
