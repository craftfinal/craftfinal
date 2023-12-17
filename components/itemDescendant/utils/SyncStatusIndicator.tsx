// @/components/itemDescendant/utils/AutoSyncStatusIndicator.tsx

"use client";

import { SyncStatus } from "@/hooks/useAutoSyncItemDescendantStore";
import { cn } from "@/lib/utils";
import { IoAlertCircle, IoCheckmarkCircle, IoSync } from "react-icons/io5";

interface SyncIndicatorProps {
  syncStatus: SyncStatus;
}

export default function SyncStatusIndicator({ syncStatus }: SyncIndicatorProps) {
  const elementClassName = {
    icon: "transition-all duration-300 w-4 h-auto md:w-5",
    text: "transition-all duration-300 text-sm md:text-base text-muted-foreground",
  };

  let content;

  switch (syncStatus) {
    case SyncStatus.Imminent:
      content = (
        <>
          <IoAlertCircle className={cn(elementClassName.icon, "text-yellow-500/75")} />
          <span className={cn(elementClassName.text)}>Unsaved changes</span>
        </>
      );
      break;
    case SyncStatus.InProgress:
      content = (
        <>
          <IoSync className={cn(elementClassName.icon, "animate-slow-spin text-blue-500/75")} />
          <span className={cn(elementClassName.text)}>Synchronizing...</span>
        </>
      );
      break;
    case SyncStatus.Succeeded:
      content = (
        <>
          <IoCheckmarkCircle className={cn(elementClassName.icon, "text-green-500/75")} />
          <span className={cn(elementClassName.text)}>Done</span>
        </>
      );
      break;
    default:
      content = (
        <>
          <IoCheckmarkCircle className={cn(elementClassName.icon, "text-slate-500/75")} />
          <span className={cn(elementClassName.text)}>In sync</span>
        </>
      );
  }

  return (
    <div className="mb-4 flex h-8 flex-row-reverse items-center justify-start gap-x-2 opacity-50 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
      {content}
    </div>
  );
}
