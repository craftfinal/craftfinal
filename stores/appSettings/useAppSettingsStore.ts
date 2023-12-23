// stores/useSettingsStore.ts
import { siteConfig } from "@/config/site";
import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AppSettingsType = {
  // Flags have an effect only in development environment
  // TODO: Make sure those flags are not exposed in settings in production
  // impersonatingUserAuthProviderId: string | null;
  isLoggingEnabled: boolean;
};

export type ItemDescendantSettingsType = {
  // Flags have an effect only in development environment
  // TODO: Make sure those flags are not exposed in settings in production
  showItemDescendantInternals: boolean;
  showItemDescendantIdentifiers: boolean;
  showItemDescendantSynchronization: boolean;
  allowDeleteAllItems: boolean;
  // Delay to wait after a modification before a sync is executed [ms]
  autoSyncDelay: number;
  // Base for exponential backoff
  autoSyncBackoffBase: number;
  // Exponent multiplier, will be multiplied with number of failed attempts
  autoSyncBackoffExponentScaleFactor: number;
  // Maximal exponent as the product of the above parameter and the number of failed attempts
  autoSyncBackoffExponentMax: number;
};

export type AppSettingsStoreState = {
  app: AppSettingsType;
  itemDescendant: ItemDescendantSettingsType;
};

export type AppSettingsStoreActions = {
  setAppSettings: (newSettings: AppSettingsType) => void;
  setItemDescendantSettings: (newSettings: ItemDescendantSettingsType) => void;
};

export type AppSettingsStore = AppSettingsStoreState & AppSettingsStoreActions;

// Selector type is used to type the return type when using the store with a selector
type AppSettingsSelectorType<T> = (state: AppSettingsStoreState) => T;

// Hook type is used as a return type when using the store
export type AppSettingsHookType = <T>(selector?: AppSettingsSelectorType<T>) => T;

const initialState = {
  app: {
    // impersonatingUserAuthProviderId: null,
    isLoggingEnabled: false,
  },

  itemDescendant: {
    showItemDescendantInternals: false,
    showItemDescendantIdentifiers: false,
    showItemDescendantSynchronization: false,
    allowDeleteAllItems: false,
    autoSyncDelay: 1,
    autoSyncBackoffBase: 2,
    autoSyncBackoffExponentScaleFactor: 2,
    autoSyncBackoffExponentMax: 10,
  },
};

export const updateGlobalLogging =
  <T extends { isLoggingEnabled: boolean }>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        set(args);
        // Update the global variable whenever isLoggingEnabled changes
        window[siteConfig.name].isLoggingEnabled = get().isLoggingEnabled;
      },
      get,
      api,
    );

const storeNameSuffix =
  process.env.NODE_ENV === "development" ? `devel.${siteConfig.canonicalDomainName}` : siteConfig.canonicalDomainName;
const storeVersion = 1;

const useAppSettingsStore = create(
  persist(
    immer<AppSettingsStore>((set /*, get */) => ({
      ...initialState,

      setAppSettings: (newSettings: AppSettingsType): void => {
        set((state) => {
          Object.assign(state.app, newSettings);
        });
      },

      setItemDescendantSettings: (newSettings: ItemDescendantSettingsType): void => {
        set((state) => {
          Object.assign(state.itemDescendant, newSettings);
        });
      },
    })),
    {
      name: `settings.${storeNameSuffix}`, // unique name for localStorage key
      version: storeVersion,
    },
  ),
);

export default useAppSettingsStore;
