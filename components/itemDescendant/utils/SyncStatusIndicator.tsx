// @/components/itemDescendant/utils/AutoSyncStatusIndicator.tsx

"use client";

import { SyncStatus } from "@/hooks/useAutoSyncItemDescendantStore";
import { cn } from "@/lib/utils";
// SyncIndicator.tsx
import { IoAlertCircle, IoCheckmarkCircle, IoSync } from "react-icons/io5";

interface SyncIndicatorProps {
  syncStatus: SyncStatus;
}

export default function SyncStatusIndicator({ syncStatus }: SyncIndicatorProps) {
  let content;

  const elementClassName = {
    icon: "w-4 h-auto md:w-5",
    text: "text-sm md:text-base text-muted-foreground",
  };

  switch (syncStatus) {
    case SyncStatus.Imminent:
      content = (
        <>
          <IoAlertCircle className={cn(elementClassName.icon, "text-muted-foreground")} />
          <span className={cn(elementClassName.text, "")}>Unsaved changes</span>
        </>
      );
      break;
    case SyncStatus.InProgress:
      content = (
        <>
          <IoSync className={cn(elementClassName.icon, "animate-spin text-blue-500/50")} />
          <span className={cn(elementClassName.text, "")}>Synchronizing...</span>
        </>
      );

      break;
    case SyncStatus.Succeeded:
      content = (
        <>
          <IoCheckmarkCircle className={cn(elementClassName.icon, "text-green-500/50")} />
          <span className={cn(elementClassName.text, "")}>Done</span>
        </>
      );
      break;
    default:
      content = (
        <>
          <IoCheckmarkCircle className={cn(elementClassName.icon, "text-slate-500/50")} />
          <span className={cn(elementClassName.text, "")}>Everything in sync</span>
        </>
      );
  }

  return <div className="mb-4 flex h-8 flex-row-reverse items-center justify-start gap-x-2">{content}</div>;
}
