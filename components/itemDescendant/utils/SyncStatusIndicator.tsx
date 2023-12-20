// @/components/itemDescendant/utils/AutoSyncStatusIndicator.tsx

"use client";

import { SyncStatus } from "@/hooks/useAutoSyncItemDescendantStore";
import { cn } from "@/lib/utils";
import { useEffect, useReducer, useState } from "react";
import { IoAlertCircle, IoCheckmarkCircle } from "react-icons/io5";

interface SyncIndicatorProps {
  syncStatus: SyncStatus;
}
type StatusAction = { type: "ADD_STATUS"; status: SyncStatus } | { type: "REMOVE_STATUS" } | { type: "GET_STATUS" };

function statusReducer(state: SyncStatus[], action: StatusAction): SyncStatus[] {
  switch (action.type) {
    case "ADD_STATUS":
      if (state.includes(action.status)) {
        return state;
      }
      return [...state, action.status];
    case "REMOVE_STATUS":
      return state.slice(1);
    default:
      return state;
  }
}

export const syncStatusDisplayDuration = 500; // Minimal duration to show state

export default function SyncStatusIndicator({ syncStatus }: SyncIndicatorProps) {
  const [queuedStatusChanges, dispatch] = useReducer(statusReducer, []);
  const [displayedStatus, setDisplayedStatus] = useState<SyncStatus | null>(syncStatus);
  const [delayStatusChange, setDelayStatusChange] = useState(false);

  useEffect(() => {
    dispatch({ type: "ADD_STATUS", status: syncStatus });
    // console.log(`ADD ${syncStatus}:`, queuedStatusChanges);
    if (!delayStatusChange && syncStatus !== displayedStatus) {
      setDelayStatusChange(true);
      const display = queuedStatusChanges[0] || syncStatus;
      setDisplayedStatus(display);
      // console.log(`setDisplayedStatus:`, display);
      setTimeout(() => {
        dispatch({ type: "REMOVE_STATUS" });
        // console.log(`REMOVE:`, queuedStatusChanges);
        setDelayStatusChange(false);
      }, syncStatusDisplayDuration);
    }
  }, [syncStatus, delayStatusChange]);

  const indicatorAnimationClassName = "transition-all duration-500 ease-in-out ";
  const elementClassName = {
    icon: "w-4 h-auto md:w-5",
    iconWrapper: cn(indicatorAnimationClassName, "flex flex-row-reverse w-4 h-auto md:w-5"),
    text: cn(indicatorAnimationClassName, "text-sm xl:text-base text-muted-foreground"),
    container: "mb-4 flex h-8 flex-row-reverse items-center justify-start gap-x-2 opacity-50 group-hover:opacity-100",
  };

  let icon, text;

  switch (displayedStatus) {
    case SyncStatus.Modified:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "")}>
          <IoAlertCircle className={cn(elementClassName.icon, "text-yellow-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text)}>Unsaved changes</span>;
      break;
    case SyncStatus.InProgress:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "")}>
          <SpinningCircleIcon className={cn(elementClassName.icon, "text-blue-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text)}>Synchronizing...</span>;
      break;
    case SyncStatus.Succeeded:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "")}>
          <IoCheckmarkCircle className={cn(elementClassName.icon, "text-green-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text)}>Done</span>;
      break;
    case SyncStatus.Failed:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "opacity-100")}>
          <IoAlertCircle className={cn(elementClassName.icon, "text-red-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text)}>Sync failed</span>;
      break;
    default:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "opacity-50")}>
          <IoCheckmarkCircle className={cn(elementClassName.icon, "text-slate-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text, "opacity-50")}>In sync</span>;
  }

  return (
    <div className={elementClassName.container}>
      {icon}
      {text}
    </div>
  );
}

function SpinningCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" {...props}>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
}
