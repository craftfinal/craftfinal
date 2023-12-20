import { ItemDescendantStoreStateType } from "@/schemas/itemDescendant";
import { PersistStorage } from "zustand/middleware";

/*
import { parse, stringify } from "devalue";
export function createTypesafeLocalstorage(): PersistStorage<ItemDescendantStoreStateType> {
  return {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      return parse(str);
    },
    setItem: (name, value) => {
      // localStorage.setItem(name, stringify(value));
      // Create a deep clone of the value, excluding functions
      const valueWithoutFunctions = JSON.parse(
        JSON.stringify(value, (key, val) => (typeof val === "function" ? undefined : val)),
      );
      localStorage.setItem(name, stringify(valueWithoutFunctions));
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  };
}
*/

export function createDateSafeLocalStorage(): PersistStorage<ItemDescendantStoreStateType> {
  return {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      const jsonTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      const item = JSON.parse(str, (key, val) => (jsonTimestamp.test(val) ? new Date(val) : val));
      // window.consoleLog(`createDateSafeLocalStorage: returning`, item);
      return item;
    },
    setItem: (name, value) => {
      // Create a deep clone of the value, excluding functions
      const valueWithoutFunctions = JSON.parse(
        JSON.stringify(value, (key, val) => (typeof val === "function" ? undefined : val)),
      );
      localStorage.setItem(name, JSON.stringify(valueWithoutFunctions));
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  };
}
