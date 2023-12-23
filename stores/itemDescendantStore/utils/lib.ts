import { ItemDescendantClientStateType, ItemDescendantServerStateType } from "@/schemas/itemDescendant";
import { StoreState } from "../createItemDescendantStore";
const jsonTimestampRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// Serialize store state, excluding all functions, to JSON
export function serializeItemDescendantState(
  storeState: StoreState | ItemDescendantClientStateType | ItemDescendantServerStateType,
): string {
  // Create a deep clone of the value, excluding functions
  const storeStateWithoutFunctions = JSON.parse(
    JSON.stringify(storeState, (key, val) => (typeof val === "function" ? undefined : val)),
  );
  return JSON.stringify(storeStateWithoutFunctions);
}

// Deserialize string to storeState while recovering `Date` objects from timestamp strings
export function deserializeItemDescendantState<
  T extends StoreState | ItemDescendantClientStateType | ItemDescendantServerStateType,
>(serializedStoreState: string): T | null {
  if (!serializedStoreState) return null;
  const storeState = JSON.parse(serializedStoreState, (key, val) =>
    jsonTimestampRegExp.test(val) ? new Date(val) : val,
  );
  return storeState;
}
