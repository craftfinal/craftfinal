// @/contexts/ItemDescendantStoreProvider.tsx
import useLogging from "@/hooks/useLogging";
import {
  ItemDescendantStoreConfigType,
  createItemDescendantStore,
} from "@/stores/itemDescendantStore/createItemDescendantStore";
// import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

export type ItemDescendantModelNameType = "user" | "resume" | "organization" | "role" | "achievement";

type StoreHookType = ReturnType<typeof createItemDescendantStore>;

// Define the type for the context value
type ItemDescendantStoreMap = {
  [key in ItemDescendantModelNameType]: StoreHookType;
};
interface ItemDescendantStores extends Partial<ItemDescendantStoreMap> {}

interface ItemDescendantStoreContextType {
  current: StoreHookType;
  switchStore: (model: ItemDescendantModelNameType) => void;
  stores: ItemDescendantStores;
}

// Create context
const ItemDescendantStoreContext = createContext<ItemDescendantStoreContextType | null>(null);

interface ItemDescendantStoreProviderProps {
  children: ReactNode;
  configs: ItemDescendantStoreConfigType[];
}

export function ItemDescendantStoreProvider({ children, configs }: ItemDescendantStoreProviderProps) {
  const [storeContext, setStoreContext] = useState<ItemDescendantStoreContextType>(() => {
    const initializedStores: ItemDescendantStores = {};

    configs.forEach((config) => {
      initializedStores[config.itemModel] = createItemDescendantStore(config);
    });

    return {
      current: initializedStores[configs[0].itemModel]!,
      switchStore: (model: ItemDescendantModelNameType) => {
        setStoreContext((prev) => ({
          ...prev,
          current: initializedStores[model]!,
        }));
      },
      stores: initializedStores,
    };
  });

  // Track initialization of stores
  const [isInitialized, setIsInitialized] = useState(false);

  // Subscribe to Zustand store `AppSettings` and update global variable
  // to determine if logging to console is enabled
  useLogging();

  useEffect(() => {
    if (!isInitialized) {
      const initializedStores = configs.reduce((acc, config) => {
        acc[config.itemModel] = createItemDescendantStore(config);
        return acc;
      }, {} as ItemDescendantStores);
      setStoreContext({
        current: initializedStores[configs[0].itemModel]!,
        switchStore: (model: ItemDescendantModelNameType) => {
          setStoreContext((prev) => ({
            ...prev!,
            current: initializedStores[model]!,
          }));
        },
        stores: initializedStores,
      });
      setIsInitialized(true);
    }
  }, [configs, isInitialized]);

  // return !isInitialized ? null : (
  //   <ItemDescendantStoreContext.Provider value={storeContext}>{children}</ItemDescendantStoreContext.Provider>
  // );

  return (
    <ItemDescendantStoreContext.Provider value={storeContext}>
      {!isInitialized ? null : children}
    </ItemDescendantStoreContext.Provider>
  );
}

// Custom hook to use the current store
export const useCurrentItemDescendantStore = () => {
  const context = useContext(ItemDescendantStoreContext);
  if (!context) {
    throw new Error("useCurrentItemDescendantStore must be used within an ItemDescendantStoreProvider");
  }

  const storeHook = context.current;
  if (!storeHook) {
    throw new Error(`Current store is not available`);
  }

  return storeHook;
};

// Custom hook to switch to a different store defined by the model
export const useSwitchItemDescendantStore = (model: ItemDescendantModelNameType) => {
  const context = useContext(ItemDescendantStoreContext);
  if (!context) {
    throw new Error("useSwitchItemDescendantStore must be used within an ItemDescendantStoreProvider");
  }

  context.switchStore(model);
  return context.current;
};

// Custom hook to use an alternative store selected by its model
export const useAlternativeItemDescendantStore = (model: ItemDescendantModelNameType) => {
  const context = useContext(ItemDescendantStoreContext);
  if (!context) {
    throw new Error("useAlternativeItemDescendantStore must be used within an ItemDescendantStoreProvider");
  }

  const storeHook = context.stores[model];
  if (!storeHook) {
    throw new Error(`Store for model ${model} is not available`);
  }

  return storeHook;
};
