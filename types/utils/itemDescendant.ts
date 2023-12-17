import { stripFields, stripToType } from "@/lib/utils/misc";
import { StateIdSchemaType } from "@/schemas/id";
import {
  ItemClientStateType,
  ItemClientToServerType,
  ItemOutputType,
  ItemServerStateType,
  itemServerStateSchema,
} from "@/schemas/item";
import {
  ItemDescendantClientStateType,
  ItemDescendantOrderableServerStateListType,
  ItemDescendantOrderableServerStateType,
  ItemDescendantServerOutputType,
  ItemDescendantServerStateType,
  itemDescendantServerStateSchema,
} from "@/schemas/itemDescendant";
import { ItemDescendantStore } from "@/stores/itemDescendantStore/createItemDescendantStore";
import { sortDescendantsByOrderValues } from "@/stores/itemDescendantStore/utils/descendantOrderValues";
import { ItemDisposition } from "../item";
import { ItemDescendantModelNameType, getDescendantModel, getItemOrderFunction } from "../itemDescendant";

export function stripFieldsForDatabase<T extends ItemClientToServerType>(item: T, fieldsToStrip: Set<keyof T>) {
  return stripFields(item, fieldsToStrip);
}
const fieldsToExcludeFromCreate = [
  "parentClientId",
  "clientId",
  "parentId",
  "id",
  "disposition",
  "itemModel",
  "descendantModel",
  "descendants",
  "descendantDraft",
];

export function getItemDataForCreate<T extends ItemClientToServerType>(item: T, parentId: StateIdSchemaType) {
  const fieldsToStrip = new Set<keyof T>([...fieldsToExcludeFromCreate] as Array<keyof T>);

  const itemData = stripFieldsForDatabase(item, fieldsToStrip);

  const payload = { ...itemData, parentId };
  return payload;
}

export function getItemDataForUpdate<T extends ItemClientToServerType>(item: T) {
  const fieldsToStrip = new Set<keyof T>([...fieldsToExcludeFromCreate] as Array<keyof T>);

  const itemData = stripFieldsForDatabase(item, fieldsToStrip);

  const payload = { ...itemData };
  return payload;
}

export function getItemDescendantStoreStateForServer<T extends ItemDescendantStore>(rootState: T) {
  // Remove all properties that are not part of the item
  const storeActions: Array<keyof T> = [
    "updateLastModifiedOfModifiedItems",
    "setItemData",
    "markItemAsDeleted",
    "restoreDeletedItem",
    "getDescendants",
    "setDescendantData",
    "markDescendantAsDeleted",
    "reArrangeDescendants",
    "resetDescendantsOrderValues",
    "getDescendantDraft",
    "updateDescendantDraft",
    "commitDescendantDraft",
    "updateStoreWithServerData",
  ];
  const nonItemRootStateProperties: Array<keyof T> = ["descendantDraft"];

  // Combine both sets of keys to remove
  const propertiesToRemove = [...storeActions, ...nonItemRootStateProperties];

  // const payload = stripFields(rootState, fieldsToStrip);
  const payload = stripToType(rootState, propertiesToRemove);
  return payload as ItemDescendantClientStateType;
}

export function augmentServerOutputToServerState(
  serverItem: ItemOutputType,
  clientItem: ItemClientStateType,
  disposition: ItemDisposition,
  updateLastModified?: Date,
): ItemServerStateType {
  const { clientId, parentClientId, itemModel, descendantModel = null } = clientItem;

  const lastModified = disposition === ItemDisposition.Synced ? clientItem.lastModified : updateLastModified;
  if (!lastModified) {
    throw Error(`augmentServerOutputToServerState: "updateLastModified" is required unless "disposition" is "Synced"`);
  }

  let augmentedItem = {
    ...serverItem,
    disposition,
    itemModel,
    descendantModel,
  } as ItemServerStateType;

  // If the client declared this as a new item, this means it does not yet have an `id`.
  // We return the clientId and parentClientId
  // to allow the client to match it
  if (clientItem.disposition === ItemDisposition.New) {
    if (clientItem.id) {
      throw Error(
        `augmentServerOutputToServerState: "clientItem.id" must not be defined if disposition="New"` +
          JSON.stringify(clientItem),
      );
    }

    augmentedItem = {
      ...augmentedItem,
      clientId,
      parentClientId,
      lastModified,
    };
  }
  itemServerStateSchema.parse(augmentedItem);

  return augmentedItem;
}

export function augmentClientStateToServerState(
  clientItem: ItemClientStateType,
  disposition: ItemDisposition,
  updateLastModified?: Date,
): ItemServerStateType {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disposition: clientDisposition,
    descendants,
    ...clientItemProperties
  } = clientItem as ItemDescendantServerStateType;

  const lastModified = disposition === ItemDisposition.Synced ? clientItem.lastModified : updateLastModified;
  if (!lastModified) {
    throw Error(`augmentServerOutputToServerState: "updateLastModified" is required unless "disposition" is "Synced"`);
  }

  let augmentedItem: ItemServerStateType;
  if (disposition === ItemDisposition.Obsoleted) {
    // Remove descendants to avoid needlessly sending back data that gets deleted by the client
    augmentedItem = {
      ...clientItemProperties,
      lastModified,
      disposition,
    };
  } else {
    augmentedItem = {
      ...clientItemProperties,
      lastModified,
      disposition,
      descendants,
    } as ItemServerStateType;
  }

  itemServerStateSchema.parse(augmentedItem);

  return augmentedItem;
}

export function augmentServerStateToDescendantServerState(
  serverItem: ItemServerStateType | ItemDescendantServerStateType,
): ItemDescendantServerStateType {
  let itemDescendantServerItem = serverItem as ItemDescendantServerStateType;
  // Check if the item already includes a descendants property
  if (!("descendants" in serverItem)) {
    // If it does not have a descendants property, add it
    itemDescendantServerItem = {
      ...serverItem,
      descendants: [], // Adding an empty descendants array
    } as ItemDescendantServerStateType;
  }
  itemDescendantServerStateSchema.parse(itemDescendantServerItem);

  return itemDescendantServerItem;
}

export function augmentToItemDescendantServerState(
  serverOutput: ItemDescendantServerOutputType,
  itemModel: ItemDescendantModelNameType,
  disposition = ItemDisposition.Initial,
  // providedParentClientId?: ClientIdType,
): ItemDescendantServerStateType {
  // Disposition property is set to `Initial` or as specified by `disposition` parameter on all items
  const dispositionProperty = {
    disposition,
  };
  const descendantModel = getDescendantModel(itemModel);
  const modelProperties = {
    itemModel,
    descendantModel,
  };

  // const parentClientId = providedParentClientId ? providedParentClientId : getClientId(getParentModel(itemModel!));
  // const clientId = getClientId(itemModel!);
  let descendants = serverOutput.descendants.map((serverDescendant) => {
    const newDescendant = augmentToItemDescendantServerState(serverDescendant, descendantModel!, disposition);
    return newDescendant;
  });

  // Ensure the descendants are of a type compatible with the sorting function
  if (descendantModel && descendants.length > 1) {
    const itemOrderFunction = getItemOrderFunction<ItemDescendantOrderableServerStateType>(descendantModel);
    if (itemOrderFunction) {
      descendants = sortDescendantsByOrderValues<ItemDescendantOrderableServerStateType>(
        descendants as ItemDescendantOrderableServerStateListType,
        itemOrderFunction,
      );
    }
  }

  const serverStateItemDescendant = {
    ...serverOutput,
    ...modelProperties,
    ...dispositionProperty,
    descendants,
  } as ItemDescendantServerStateType;
  // console.log(
  //   `augmentToItemDescendantServerState: serverOutput:`,
  //   serverOutput,
  //   "\nserverStateItemDescendant:",
  //   serverStateItemDescendant,
  // );
  itemDescendantServerStateSchema.parse(serverStateItemDescendant);

  return serverStateItemDescendant;
}

/**
 * Finds the index of a descendant object in a given array.
 * @param arr - Array of Items.
 * @param id - ID of the descendant object.
 * @returns The index of the descendant object in the array.
 */

export const findItemIndexByClientId = (arr: Array<ItemClientStateType>, id: StateIdSchemaType): number => {
  return arr.findIndex((descendant) => descendant.clientId === id);
};
