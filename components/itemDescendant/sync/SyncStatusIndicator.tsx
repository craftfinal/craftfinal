// @/components/itemDescendant/utils/AutoSyncStatusIndicator.tsx

"use client";

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { StoreSyncStatus } from "@/hooks/useAutoSyncItemDescendantStore";
import { cn } from "@/lib/utils";
import { useEffect, useReducer, useState } from "react";
import { IoAlertCircle, IoCheckmarkCircle } from "react-icons/io5";

interface SyncIndicatorProps {
  syncStatus?: StoreSyncStatus;
}
type StatusAction =
  | { type: "ADD_STATUS"; status: StoreSyncStatus }
  | { type: "REMOVE_STATUS" }
  | { type: "GET_STATUS" };

function statusReducer(state: StoreSyncStatus[], action: StatusAction): StoreSyncStatus[] {
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
  // const syncStatusHook = useSyncStatus();
  const store = useCurrentItemDescendantStore();
  const syncStatusHook = store((state) => state.syncStatus);

  const currenSyncStatus = syncStatus ?? syncStatusHook;
  const [queuedStatusChanges, dispatch] = useReducer(statusReducer, []);
  const [displayedStatus, setDisplayedStatus] = useState<StoreSyncStatus | null>(currenSyncStatus);
  const [delayStatusChange, setDelayStatusChange] = useState(false);

  useEffect(() => {
    dispatch({ type: "ADD_STATUS", status: currenSyncStatus });
    // console.log(`ADD ${currenSyncStatus}:`, queuedStatusChanges);
    if (!delayStatusChange && currenSyncStatus !== displayedStatus) {
      setDelayStatusChange(true);
      const display = queuedStatusChanges[0] || currenSyncStatus;
      setDisplayedStatus(display);
      // console.log(`setDisplayedStatus:`, display);
      setTimeout(() => {
        dispatch({ type: "REMOVE_STATUS" });
        // console.log(`REMOVE:`, queuedStatusChanges);
        setDelayStatusChange(false);
      }, syncStatusDisplayDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currenSyncStatus, delayStatusChange, syncStatusHook]);

  const indicatorAnimationClassName = "transition-all duration-500 ease-in-out ";
  const elementClassName = {
    icon: "w-4 h-auto md:w-5",
    iconWrapper: cn(indicatorAnimationClassName, "flex flex-row-reverse w-4 h-auto md:w-5"),
    text: cn(indicatorAnimationClassName, "text-sm xl:text-base text-muted-foreground"),
    container: "mb-4 flex h-8 flex-row-reverse items-center justify-start gap-x-2 opacity-50 group-hover:opacity-100",
  };

  let icon, text;

  switch (displayedStatus) {
    case StoreSyncStatus.Modified:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "")}>
          <IoAlertCircle className={cn(elementClassName.icon, "text-yellow-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text)}>Unsaved changes</span>;
      break;
    case StoreSyncStatus.InProgress:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "")}>
          <SpinningCircleIcon className={cn(elementClassName.icon, "text-blue-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text)}>Synchronizing...</span>;
      break;
    case StoreSyncStatus.Succeeded:
      icon = (
        <div className={cn(elementClassName.iconWrapper, "")}>
          <IoCheckmarkCircle className={cn(elementClassName.icon, "text-green-500/75")} />
        </div>
      );
      text = <span className={cn(elementClassName.text)}>Done</span>;
      break;
    case StoreSyncStatus.Failed:
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

export function SpinningCircleIconTrueNAS(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 100 100" stroke="currentColor" {...props}>
      <circle
        cx="50%"
        cy="50%"
        r="45"
        strokeDasharray="282.743px"
        strokeDashoffset="141.372px"
        strokeWidth="10%"
      ></circle>
    </svg>
  );
}
