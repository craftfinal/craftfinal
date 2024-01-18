// @/stores/itemDescendant/createItemDescendantStore.ts
import { siteConfig } from "@/config/site";
import { StoreSyncStatus } from "@/components/itemDescendant/hooks/useAutoSyncItemDescendantStore";
import { dateToISOLocal } from "@/lib/utils/formatDate";
import { StateIdSchemaType, generateClientId } from "@/schemas/id";
import { ItemDataType, ItemDataUntypedType, ItemOrderableClientStateType } from "@/schemas/item";
import {
  ItemDescendantOrderableClientStateListType,
  ItemDescendantOrderableStoreStateListType,
  ItemDescendantOrderableStoreStateType,
  ItemDescendantServerStateType,
  ItemDescendantStoreStateListType,
  ItemDescendantStoreStateType,
  itemDescendantOrderableStoreStateSchema,
  itemDescendantStoreStateSchema,
} from "@/schemas/itemDescendant";
import { createDateSafeLocalStorage } from "@/stores/itemDescendantStore/utils/createDateSafeLocalStorage";
import { ClientIdType, ItemDisposition } from "@/types/item";
import { ItemDescendantModelNameType, getDescendantModel } from "@/types/itemDescendant";
import { getItemDescendantStoreStateForServer } from "@/types/utils/itemDescendant";
import { Draft } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  getOrderValueForAppending,
  reBalanceListOrderValues,
  updateListOrderValues,
} from "./utils/descendantOrderValues";
import { handleNestedItemDescendantListFromServer, syncStoreWithServer } from "./utils/syncItemDescendantStore";

export type ItemDescendantStoreHook = ReturnType<typeof createItemDescendantStore>;

// NOTE: This type must be kept in sync with:
// `ItemDescendantStoreStateType` in `@/schemas/itemDescendant`
// `getItemDescendantStoreStateForServer` in `@/types/utils/itemDescendant`
export type StoreState = ItemDescendantStoreStateType & {
  // Status of store synchronization with server
  syncStatus: StoreSyncStatus;
  // Number of consecutive failed attempts
  numFailedAttempts: number;
  // Time of last successful synchronization with server
  lastSyncTime: Date | null;
  // Pending timeout to synchronize store, or null
  syncTimeout: NodeJS.Timeout | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useAppSettingsStore: any;
};

export type StoreActions = {
  setItemData: (data: ItemDataUntypedType) => void;
  markItemAsDeleted: () => void;
  restoreDeletedItem: () => void;
  getDescendants: (ancestorChain: Array<ClientIdType>) => ItemDescendantStoreStateListType;
  setDescendantData: (
    descendantData: ItemDataUntypedType,
    clientId: ClientIdType,
    ancestorChain: Array<ClientIdType>,
  ) => void;
  markDescendantAsDeleted: (clientId: ClientIdType, ancestorChain: Array<ClientIdType>) => void;
  reArrangeDescendants: (
    reArrangedDescendants: ItemDescendantOrderableClientStateListType,
    ancestorChain: Array<ClientIdType>,
  ) => void;
  resetDescendantsOrderValues: (ancestorChain: Array<ClientIdType>) => void;
  getDescendantDraft: (ancestorChain: Array<ClientIdType>) => ItemDataUntypedType;
  updateDescendantDraft: (descendantData: ItemDataUntypedType, ancestorChain: Array<ClientIdType>) => void;
  commitDescendantDraft: (ancestorChain: Array<ClientIdType>) => void;

  setSyncStatus: (status: StoreSyncStatus) => void;
  syncWithServer: (resetBackoff?: boolean, forceUpdate?: boolean) => void;
  scheduleSyncWithServer: () => void;
  updateStoreWithServerData: (serverState: ItemDescendantServerStateType) => void;
  updateLastModifiedOfModifiedItems: (overrideLastModified?: Date) => void;

  getNumFailedAttempts: () => number;
  incrementFailedAttempts: () => number;
  resetFailedAttempts: () => void;
  setLastSyncTime: (time: Date | null) => void;
  setSyncTimeout: (timeout: NodeJS.Timeout | null) => void;
  cancelSyncTimeout: () => void;
  resetSyncScheduler: () => void;
  getSyncDelay: () => number;
};

export type ItemDescendantStore = StoreState & StoreActions;

// Selector type is used to type the return type when using the store with a selector
type ItemDescendantSelectorType<T> = (state: ItemDescendantStore) => T;

// Hook type is used as a return type when using the store
export type ItemDescendantHookType<T> = (selector?: ItemDescendantSelectorType<T>) => T;

export interface ItemDescendantStoreConfigType {
  itemModel: ItemDescendantModelNameType;

  parentClientId: ClientIdType;
  clientId: ClientIdType;

  parentId: StateIdSchemaType | undefined;
  id: StateIdSchemaType | undefined;

  storeName?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useAppSettingsStore: any;
}

const storeNameSuffix =
  process.env.NODE_ENV === "development" ? `devel.${siteConfig.canonicalDomainName}` : siteConfig.canonicalDomainName;

export const createItemDescendantStore = (storeConfig: ItemDescendantStoreConfigType) => {
  const { parentClientId, clientId, parentId, id, itemModel, storeName, useAppSettingsStore } = storeConfig;

  const currentStoreName = storeName ?? `${itemModel}-${storeNameSuffix}`;

  const initialState = {
    parentClientId,
    clientId,
    parentId,
    id,
    createdAt: new Date(0),
    lastModified: new Date(0),
    deletedAt: null,
    disposition: ItemDisposition.Modified,

    itemModel: itemModel,
    descendantModel: getDescendantModel(itemModel),
    descendants: [],
    descendantDraft: {} as ItemDataUntypedType,

    syncStatus: StoreSyncStatus.Synced,
    numFailedAttempts: 0,
    lastSyncTime: null,
    syncTimeout: null,

    useAppSettingsStore,
  };

  // NOTE: Consider adding a migration path at the end of the `create` function below
  // when changing the storeVersion
  const storeVersion = 2;

  return create(
    persist(
      immer<ItemDescendantStore>((set, get) => ({
        ...initialState,

        setItemData: (descendantData: ItemDataUntypedType): void => {
          const now = new Date();
          set((state) => {
            // Loop through each key in descendantData and update the state
            // Assuming ItemDataUntypedType is a type that can be safely assigned to the state
            Object.entries(descendantData).forEach(([key, value]) => {
              if (key in state) {
                // Type assertion to convince TypeScript about the assignment
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (state as any)[key] = value;
              }
            });
            state.disposition = ItemDisposition.Modified;
            state.lastModified = now;
          });
        },
        markItemAsDeleted: (): void => {
          // Update the state with the deletedAt timestamp for the item
          const now = new Date();
          set((state) => {
            // NOTE: The below assignment with the spread operator does not work due to the use of `immer`
            // state = { ...state, disposition: ItemDisposition.Modified, deletedAt: new Date() };
            state.disposition = ItemDisposition.Modified;
            state.deletedAt = now;

            // Update the modification timestamp to ensure the server picks up the update
            state.lastModified = now;
          });
        },
        restoreDeletedItem: (): void => {
          // Update the state with the deletedAt timestamp for the item
          const now = new Date();
          set((state) => {
            state.disposition = ItemDisposition.Modified;
            state.deletedAt = null;

            // Update the modification timestamp
            state.lastModified = now;
          });
        },
        getDescendants: (ancestorChain: Array<ClientIdType>): ItemDescendantStoreStateListType => {
          const ancestorStateChain = getDescendantFromAncestorChain([get()], ancestorChain);
          const ancestorState = ancestorStateChain[0];
          return ancestorState.descendants;
        },
        setDescendantData: (
          descendantData: ItemDataUntypedType,
          clientId: ClientIdType,
          ancestorChain: Array<ClientIdType>,
        ): void => {
          const now = new Date();
          set((state) => {
            const ancestorStateChain = getDescendantFromAncestorChain([state], ancestorChain, now);
            const ancestorState = ancestorStateChain[0];
            // Update the state with the deletedAt timestamp for the specified descendant
            ancestorState.descendants = ancestorState.descendants.map((descendant) => {
              if (descendant.clientId === clientId) {
                return {
                  ...descendant,
                  ...descendantData,
                  disposition: ItemDisposition.Modified,
                  lastModified: now,
                };
              }
              return descendant;
            });
          });
        },
        markDescendantAsDeleted: (clientId: ClientIdType, ancestorChain: Array<ClientIdType>): void => {
          const now = new Date();
          set((state) => {
            const ancestorStateChain = getDescendantFromAncestorChain([state], ancestorChain, now);
            const ancestorState = ancestorStateChain[0];
            // Update the state with the deletedAt timestamp for the specified descendant
            ancestorState.descendants = ancestorState.descendants.map((descendant) => {
              if (descendant.clientId === clientId) {
                return {
                  ...descendant,
                  disposition: ItemDisposition.Modified,
                  deletedAt: now,
                  // Update the modification timestamp to ensure the server picks up the update
                  lastModified: now,
                };
              }
              return descendant;
            });
          });
        },
        reArrangeDescendants: (
          reArrangedDescendants: ItemDescendantOrderableClientStateListType,
          ancestorChain: Array<ClientIdType>,
        ): void => {
          const now = new Date();
          set((state) => {
            const ancestorStateChain = getDescendantFromAncestorChain([state], ancestorChain, now);
            const ancestorState = ancestorStateChain[0];
            // Update the state with the re-ordered descendants
            ancestorState.descendants = updateListOrderValues(
              reArrangedDescendants as unknown as Array<ItemOrderableClientStateType>,
              now,
            ) as unknown as Draft<ItemDescendantOrderableStoreStateListType>;
          });
        },
        resetDescendantsOrderValues: (ancestorChain: Array<ClientIdType>): void => {
          const now = new Date();
          set((state) => {
            const ancestorStateChain = getDescendantFromAncestorChain([state], ancestorChain, now);
            const ancestorState = ancestorStateChain[0];
            // Update the state with the descendants having balanced order values
            ancestorState.descendants = reBalanceListOrderValues(
              ancestorState.descendants as unknown as Array<ItemOrderableClientStateType>,
              now,
              true,
            ) as unknown as Draft<ItemDescendantOrderableStoreStateListType>;
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getDescendantDraft: (ancestorChain: Array<ClientIdType>): ItemDataType<any> => {
          const ancestorStateChain = getDescendantFromAncestorChain([get()], ancestorChain);
          const ancestorState = ancestorStateChain[0];
          return ancestorState.descendantDraft;
        },
        updateDescendantDraft: (descendantData: ItemDataUntypedType, ancestorChain: Array<ClientIdType>) => {
          set((state) => {
            const ancestorStateChain = getDescendantFromAncestorChain([state], ancestorChain);
            // Update the state with the new draft descendant data
            const ancestorState = ancestorStateChain[0];
            ancestorState.descendantDraft = {
              ...(ancestorState.descendantDraft as ItemDataUntypedType),
              ...descendantData,
            } as Draft<ItemDataUntypedType>;
          });
        },
        commitDescendantDraft: (ancestorChain: Array<ClientIdType>) => {
          set((state) => {
            const ancestorStateChain = getDescendantFromAncestorChain([state], ancestorChain, new Date());
            const ancestorState = ancestorStateChain[0];
            const descendantOfDescendantModel = ancestorState.descendantModel
              ? getDescendantModel(ancestorState.descendantModel)
              : null;
            const descendantModel = ancestorState.descendantModel;
            const descendantClientId = generateClientId(descendantModel ?? undefined);

            if (!ancestorState.descendantModel) {
              throw Error(
                `commitDescendantDraft: ancestorState has invalid descendantModel: ${JSON.stringify(ancestorState)}`,
              );
            }

            // Create a copy of the draft
            const descendantData = {
              ...ancestorState.descendantDraft,
              itemModel: descendantModel!,
              clientId: descendantClientId,
              parentClientId: ancestorState.clientId,
              parentId: ancestorState.id,
              createdAt: new Date(),
              lastModified: new Date(),
              deletedAt: null,
              disposition: ItemDisposition.New,
              descendantModel: descendantOfDescendantModel,
              descendants: [],
              descendantDraft: {} as Draft<ItemDataUntypedType>,
            };

            let newDescendant;
            // Add the `order` field if the model requires it
            if (["achievement"].includes(descendantModel!)) {
              newDescendant = {
                ...descendantData,
                order: getOrderValueForAppending(
                  ancestorState.descendants as unknown as ItemOrderableClientStateType[],
                ),
              } as Draft<ItemDescendantOrderableStoreStateType>;
              itemDescendantOrderableStoreStateSchema.parse(newDescendant);
            } else {
              newDescendant = descendantData;
              itemDescendantStoreStateSchema.parse(newDescendant);
            }

            // Append it to the end of the store's `descendants` array
            ancestorState.descendants = ancestorState.descendants.length
              ? [...ancestorState.descendants, newDescendant]
              : [newDescendant];

            // Reset the draft
            ancestorState.descendantDraft = {} as Draft<ItemDataUntypedType>;
            for (const ancestorState of ancestorStateChain) {
              // Update the modification timestamp of the ancestor
              ancestorState.lastModified = new Date();
            }
          });
        },

        setSyncStatus: (status: StoreSyncStatus) =>
          set((state) => {
            state.syncStatus = status;
          }),
        getNumFailedAttempts: (): number => {
          return get().numFailedAttempts;
        },
        incrementFailedAttempts: () => {
          set((state) => {
            state.numFailedAttempts += 1;
          });
          return get().numFailedAttempts;
        },
        resetFailedAttempts: () =>
          set((state) => {
            state.numFailedAttempts = 0;
          }),
        setLastSyncTime: (time: Date | null) =>
          set((state) => {
            state.lastSyncTime = time;
          }),
        setSyncTimeout: (timeout: NodeJS.Timeout | null) =>
          set((state) => {
            state.syncTimeout = timeout;
          }),
        cancelSyncTimeout: () =>
          set((state) => {
            if (state.syncTimeout) {
              clearTimeout(state.syncTimeout);
            }
            state.syncTimeout = null;
          }),
        resetSyncScheduler: () => {
          get().cancelSyncTimeout();
          get().resetFailedAttempts();
        },
        getSyncDelay: (): number => {
          // Access the latest state of the AppSettingsStore
          const storeSettings = useAppSettingsStore.getState().itemDescendant;
          const autoSyncDelay = storeSettings.autoSyncDelay;
          const autoSyncBackoffBase = storeSettings.autoSyncBackoffBase;
          const autoSyncBackoffExponentScaleFactor = storeSettings.autoSyncBackoffExponentScaleFactor;
          const autoSyncBackoffExponentMax = storeSettings.autoSyncBackoffExponentMax;

          const now = new Date();
          let delay = autoSyncDelay * 1000;
          // Adjust delay if last sync was less than `backoffInterval` ago
          const lastSyncTime = get().lastSyncTime;
          if (lastSyncTime) {
            const timeSinceLastSync = now.getTime() - lastSyncTime.getTime();
            // Increase waiting period between attempts up to threshold
            const backoffIntervalSecondsRaw: number =
              autoSyncDelay *
              autoSyncBackoffBase **
                Math.min(autoSyncBackoffExponentScaleFactor * get().numFailedAttempts, autoSyncBackoffExponentMax);
            let backoffIntervalSeconds = 0;
            if (backoffIntervalSecondsRaw < 5) {
              backoffIntervalSeconds = Math.round(backoffIntervalSecondsRaw * 10) / 10;
            } else if (backoffIntervalSecondsRaw < 10) {
              backoffIntervalSeconds = Math.round(backoffIntervalSecondsRaw);
            } else if (backoffIntervalSecondsRaw < 60) {
              backoffIntervalSeconds = Math.round(backoffIntervalSecondsRaw / 10) * 10;
            } else if (backoffIntervalSecondsRaw < 240) {
              backoffIntervalSeconds = Math.round(backoffIntervalSecondsRaw / 30) * 30;
            } else if (backoffIntervalSecondsRaw < 900) {
              backoffIntervalSeconds = Math.round(backoffIntervalSecondsRaw / 60) * 60;
            } else {
              backoffIntervalSeconds = Math.round(backoffIntervalSecondsRaw / 300) * 300;
            }
            const backoffInterval = backoffIntervalSeconds * 1000;
            if (timeSinceLastSync < backoffInterval) {
              window.consoleLog(
                `useAutoSyncItemDescendantStore: ${
                  get().numFailedAttempts
                } attempts failed in a row; wait for backoffInterval=${backoffInterval / 1000} seconds`,
              );
              delay = backoffInterval - timeSinceLastSync;
            }
          }
          return delay;
        },

        syncWithServer: (resetBackoff?: boolean, forceUpdate?: boolean): void => {
          set((state) => {
            state.syncStatus = StoreSyncStatus.InProgress;
            const rootState = getItemDescendantStoreStateForServer(state);
            // Make sure we only pass required state and required actions to the async function
            syncStoreWithServer(
              rootState,
              state.updateLastModifiedOfModifiedItems,
              state.updateStoreWithServerData,
              state.scheduleSyncWithServer,
              state.getNumFailedAttempts,
              state.incrementFailedAttempts,
              state.resetFailedAttempts,
              state.setLastSyncTime,
              state.resetSyncScheduler,
              resetBackoff,
              forceUpdate,
            ).then((syncResult) => {
              // Update syncStatus based on the result of the sync operation
              set({ syncStatus: syncResult });
            });
          });
        },
        scheduleSyncWithServer: (): void => {
          set((state) => {
            // A sync is running, let's schedule the next unless one is scheduled
            if (state.syncTimeout) {
              window.consoleLog(
                `scheduleSyncWithServer: not scheduling a sync as one is already scheduled:`,
                state.syncTimeout,
              );
              return;
            }
            const delay = state.getSyncDelay();
            const newSyncTimeout = setTimeout(() => {
              window.consoleLog(`scheduleSyncWithServer: initiating scheduled syncWithServer`);
              get().setSyncTimeout(null);
              get().syncWithServer();
            }, delay);
            const nextSync = new Date(new Date().getTime() + delay);
            state.syncTimeout = newSyncTimeout;
            window.consoleLog(
              `scheduleSyncWithServer: scheduled a sync in ${delay / 1000}s at ${dateToISOLocal(nextSync)}:`,
              state.syncTimeout,
            );
          });
        },
        updateStoreWithServerData: (serverState: ItemDescendantServerStateType) => {
          set((state) => {
            handleNestedItemDescendantListFromServer(state, serverState);
          });
        },
        /**
         * Updates the lastModified timestamp of all modified items and descendants in the store.
         * If overrideLastModified is provided, it uses this timestamp; otherwise, it uses the most recent
         * timestamp of any modified descendant.
         *
         * @param {number | undefined} overrideLastModified - Optional timestamp to override the lastModified value.
         */
        updateLastModifiedOfModifiedItems: (overrideLastModified?: Date) => {
          set((state) => {
            const updatedState = updateItemToLastModifiedDescendant(state, overrideLastModified);
            state.descendants = updatedState.descendants;
            state.lastModified = updatedState.lastModified;
          });
        },
      })),
      {
        version: storeVersion, // a migration will be triggered if the version in the persisted state in localStorage does not match this one
        name: currentStoreName,
        storage: createDateSafeLocalStorage(),
        migrate: (persistedState, persistedVersion) => {
          try {
            itemDescendantStoreStateSchema.parse(persistedState);
            window.consoleLog(
              `createItemDescendantStore.migrate: validated persistedVersion=${persistedVersion} against itemDescendantStoreStateSchema of ${storeVersion}=storeVersion`,
            );
            return persistedState as ItemDescendantStore;
          } catch (error) {
            window.consoleLog(
              `createItemDescendantStore.migrate: persistedVersion=${persistedVersion} failed validation against itemDescendantStoreStateSchema of ${storeVersion}=storeVersion; returning {}`,
            );
            return {} as ItemDescendantStore;
          }
        },
      },
    ),
  );
};

function getDescendantFromAncestorChain(
  ancestorStateChain: ItemDescendantStoreStateListType,
  ancestorChain: Array<ClientIdType>,
  lastModified?: Date,
): ItemDescendantStoreStateListType {
  /*
  window.consoleLog(
    "getDescendantFromAncestorChain:\n",
    `ancestorStateChain: ${ancestorStateChain.map((item) => item.clientId).join("->")}`,
    "\n",
    `ancestorChain: ${ancestorChain.join("->")}`,
  );
  */
  // Descend from the `state` all the way down to the descendant based on the `ancestorChain` array
  const state = ancestorStateChain[0];
  if (lastModified) {
    state.lastModified = lastModified;
    state.disposition = ItemDisposition.Modified;
  }
  if (!ancestorChain || ancestorChain.length === 0) {
    return ancestorStateChain;
  }
  const ancestorClientId = ancestorChain[ancestorChain.length - 2];
  const ancestorState = state.descendants.find((descendant) => descendant.clientId === ancestorClientId) as StoreState;
  if (ancestorState) {
    if (lastModified) {
      ancestorState.lastModified = lastModified;
      ancestorState.disposition = ItemDisposition.Modified;
    }
    return getDescendantFromAncestorChain(
      [ancestorState, ...ancestorStateChain],
      ancestorChain.slice(0, -1),
      lastModified,
    );
  }
  return ancestorStateChain;
}

/**
 * Recursively updates the lastModified timestamp of the item and its descendants.
 * If an override timestamp is provided, it updates the timestamp to this value;
 * otherwise, it uses the most recent timestamp of any modified descendant.
 *
 * @param {ItemDescendantStoreStateType} item - The item to update.
 * @param {Date | undefined} overrideLastModified - Optional override timestamp.
 * @returns {ItemDescendantStoreStateType} - The updated item.
 */
function updateItemToLastModifiedDescendant(
  item: ItemDescendantStoreStateType,
  overrideLastModified?: Date,
): ItemDescendantStoreStateType {
  // Base case: If the item has no descendants, return the item as is
  if (!item.descendants || item.descendants.length === 0) {
    if (item.disposition !== ItemDisposition.Synced) {
      return { ...item, lastModified: overrideLastModified ?? item.lastModified };
    }
    return item;
  }

  // Recursive case: Traverse the descendants and update their lastModified timestamps
  // If `overrideLastModified` is provided, the latestTimestamp is updated to whatever is more recent
  let latestTimestamp = item.lastModified;
  if (item.disposition !== ItemDisposition.Synced && overrideLastModified && overrideLastModified > item.lastModified) {
    latestTimestamp = overrideLastModified;
  }
  const updatedDescendants = item.descendants.map((descendant) => {
    // Update each descendant recursively
    const updatedDescendant = updateItemToLastModifiedDescendant(descendant, overrideLastModified);

    // Find the latest timestamp among descendants
    if (updatedDescendant.lastModified > latestTimestamp) {
      latestTimestamp = updatedDescendant.lastModified;
    }

    return updatedDescendant;
  });

  // Update the item's lastModified timestamp if a descendant has a more recent timestamp
  // or if the item itself is not synced
  if (latestTimestamp > item.lastModified || item.disposition !== ItemDisposition.Synced) {
    return {
      ...item,
      lastModified: latestTimestamp,
      descendants: updatedDescendants,
    };
  }

  // If no descendant has a more recent timestamp and item is synced, return the item with updated descendants
  return {
    ...item,
    descendants: updatedDescendants,
  };
}
