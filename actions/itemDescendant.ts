// @/actions/itemDescendant.ts

"use server";

import { prismaClient } from "@/prisma/client";
import {
  DbIdSchemaType,
  StateIdSchemaType,
  dbIdDefault,
  getDbIdAndModelFromStateId,
  getDbIdFromStateId,
  getStateIdFromDbId,
  isValidStateId,
} from "@/schemas/id";
import { ItemClientStateType, ItemClientToServerType, ItemServerOutputType } from "@/schemas/item";
import { ItemDescendantServerOutputListType, ItemDescendantServerOutputType } from "@/schemas/itemDescendant";
import { UserOutputType } from "@/schemas/user";
import {
  ItemDescendantModelNameType,
  PrismaModelMethods,
  getDescendantModel,
  getModelAccessor,
  getParentModel,
  itemDescendantModelHierarchy,
} from "@/types/itemDescendant";
import { getItemDataForCreate, getItemDataForUpdate } from "@/types/utils/itemDescendant";
import { PrismaClient } from "@prisma/client";

// As the root model does not have a parent, we initialize its `parentId` to the default dbId
function ensureDbItemHasParentId(dbItem: ItemServerOutputType, itemModel: ItemDescendantModelNameType) {
  if (!dbItem.parentId && itemModel === itemDescendantModelHierarchy[0]) {
    // Since this item's model is the root model, we set its parentId to the default dbId
    return { ...dbItem, parentId: dbIdDefault };
  }
  return dbItem;
}

function getItemFromDbItem(itemModel: ItemDescendantModelNameType, dbItem: ItemServerOutputType) {
  const itemId = getStateIdFromDbId(dbItem.id, itemModel);
  const parentModel = getParentModel(itemModel);
  const parentId = getStateIdFromDbId(dbItem.parentId, parentModel ?? undefined);
  const item = { ...dbItem, id: itemId, parentId };
  return item;
}
export async function getItemById(
  prismaItemModelInstance: PrismaModelMethods[ItemDescendantModelNameType],
  itemModel: ItemDescendantModelNameType,
  itemId: StateIdSchemaType,
): Promise<ItemServerOutputType> {
  const logPrefix = `getItem(itemModel=${itemModel}, itemId=${itemId})`;
  if (!isValidStateId(itemId)) {
    throw Error(logPrefix + `: for ${itemModel} the provided itemId="${itemId}" is not valid`);
  }
  const { dbId, model } = getDbIdAndModelFromStateId(itemId);
  if ((model as string) !== itemModel) {
    throw Error(logPrefix + `: itemModel does not match itemId.model=${model}`);
  }

  const dbOutput = await prismaItemModelInstance.findUnique({
    where: { id: dbId },
  });
  if (!dbOutput) {
    throw Error(logPrefix + `${itemModel}.SELECT(id=${dbId})`);
  }

  const dbItem = ensureDbItemHasParentId(dbOutput, itemModel);
  const item = getItemFromDbItem(itemModel, dbItem);
  return item;
}

export async function updateWithClientItem(
  prismaItemModelInstance: PrismaModelMethods[ItemDescendantModelNameType],
  clientItem: ItemClientStateType,
  providedLogPrefix?: string,
): Promise<ItemServerOutputType> {
  const itemModel = clientItem.itemModel;
  const itemId = clientItem.id!;
  const logPrefix = providedLogPrefix ?? `updateWithClientItem(itemModel=${itemModel}, itemId=${itemId})`;
  if (!isValidStateId(itemId)) {
    throw Error(logPrefix + `: for ${itemModel} the provided itemId="${itemId}" is not valid`);
  }

  let data;
  // The `User` model requires special treatment
  // FIXME: Incorporate special handling of `User` into `getItemDataForUpdate`
  if (clientItem.itemModel === "user") {
    const { createdAt, lastModified, deletedAt, email, firstName, lastName } = clientItem as unknown as UserOutputType;
    data = { createdAt, lastModified, deletedAt, email, firstName, lastName };
  } else {
    data = getItemDataForUpdate<ItemClientToServerType>(clientItem);
  }

  const { dbId, model } = getDbIdAndModelFromStateId(itemId);
  if ((model as string) !== itemModel) {
    throw Error(logPrefix + `: itemModel does not match itemId.model=${model}`);
  }

  // console.log(logPrefix, `UPDATE `, "\n", clientItem);
  console.log(logPrefix, `${clientItem.itemModel}.UPDATE(id=${dbId}):`, "\n", data);

  const dbOutput = await prismaItemModelInstance.update({
    where: { id: dbId },
    data,
  });
  if (!dbOutput) {
    throw Error(logPrefix + `${clientItem.itemModel}.UPDATE(id=${dbId}):` + "\n" + JSON.stringify(data));
  }

  const dbItem = ensureDbItemHasParentId(dbOutput, itemModel);
  const item = getItemFromDbItem(itemModel, dbItem);
  return item;
}

export async function createFromClientItem(
  prismaItemModelInstance: PrismaModelMethods[ItemDescendantModelNameType],
  clientItem: ItemClientStateType,
  parentId: StateIdSchemaType,
  providedLogPrefix?: string,
): Promise<ItemServerOutputType> {
  const itemModel = clientItem.itemModel;
  const logPrefix = providedLogPrefix ?? `createFromClientItem(itemModel=${itemModel}, parentId=${parentId})`;

  const data = getItemDataForCreate<ItemClientToServerType>(clientItem, parentId);

  const { dbId, model } = getDbIdAndModelFromStateId(parentId);
  const parentModel = getParentModel(itemModel);
  if (parentModel) {
    if ((model as string) !== parentModel) {
      throw Error(logPrefix + `: parentModel does not match parentId.model=${model}`);
    }
  }

  const dbData = { ...data, parentId: dbId };
  console.log(logPrefix, `createFromClientItem: CREATE `, "\n", clientItem);
  console.log(logPrefix, `${clientItem.itemModel}.create:`, "\n", dbData);

  const dbOutput = await prismaItemModelInstance.create({
    data: dbData,
  });

  if (!dbOutput) {
    throw Error(logPrefix + `${clientItem.itemModel}.CREATE(id=${dbId}):` + "\n" + JSON.stringify(data));
  }

  const dbItem = ensureDbItemHasParentId(dbOutput, clientItem.itemModel);
  const item = getItemFromDbItem(itemModel, dbItem);
  return item;
}

async function getDbItem(
  itemModel: ItemDescendantModelNameType,
  id: StateIdSchemaType,
  prismaTransaction?: PrismaClient,
): Promise<ItemServerOutputType> {
  const transactionClient = prismaTransaction ?? prismaClient;
  const prismaModelInstance = getModelAccessor(itemModel, transactionClient);
  const dbOutput = await prismaModelInstance.findUnique({
    where: { id },
  });
  if (!dbOutput) {
    const errMsg = `getItem(model=${itemModel}, id=${id}): no record found with this id`;
    console.error(errMsg);
    throw Error(errMsg);
  }

  const dbItem = ensureDbItemHasParentId(dbOutput, itemModel);
  return dbItem;
}

async function getDbItemsByDbParentId(
  itemModel: ItemDescendantModelNameType,
  parentId: DbIdSchemaType,
  prismaTransaction?: PrismaClient,
): Promise<ItemDescendantServerOutputListType> {
  const transactionClient = prismaTransaction ?? prismaClient;
  const prismaItemModelInstance = getModelAccessor(itemModel, transactionClient);
  let whereClause: Record<string, string | undefined> = { parentId };
  if (parentId === dbIdDefault) {
    whereClause = { id: undefined };
  }
  // Retrieve the items
  const items = await prismaItemModelInstance.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
  });
  return items;
}

export async function getItemsByParentId(
  itemModel: ItemDescendantModelNameType,
  parentId: StateIdSchemaType,
  prismaTransaction?: PrismaClient,
): Promise<ItemDescendantServerOutputListType> {
  const dbParentId = getDbIdFromStateId(parentId);
  const dbItems = await getDbItemsByDbParentId(itemModel, dbParentId, prismaTransaction);

  const items = dbItems.map((item) => {
    return { ...item, id: getStateIdFromDbId(item.id, itemModel), parentId };
  });
  return items;
}

async function getDbItemDescendantList(
  itemModel: ItemDescendantModelNameType,
  dbItemId: DbIdSchemaType,
  prismaTransaction?: PrismaClient,
): Promise<ItemDescendantServerOutputType> {
  const executeLogic = async (prismaClient: PrismaClient) => {
    // const logPrefix = `getItemDescendantList(itemModel=${itemModel}, dbItemId=${dbItemId})`;

    const dbItem = await getDbItem(itemModel, dbItemId, prismaClient);
    let dbDescendants: Array<ItemDescendantServerOutputType> = [];

    // Fetch the items that are direct descendants of the item
    const descendantModel = getDescendantModel(itemModel);

    if (descendantModel) {
      const itemDescendants = await getDbItemsByDbParentId(descendantModel, dbItemId, prismaClient);

      if (itemDescendants && itemDescendants.length > 0) {
        // console.log(
        //   `${logPrefix}: returning ${itemDescendants.length}`,
        //   itemDescendants.length != 1 ? "descendants: " : "descendant: ",
        //   itemDescendants,
        // );
        // For each item, fetch its descendants recursively
        const descendantModel = getDescendantModel(itemModel);
        if (descendantModel) {
          dbDescendants = await Promise.all(
            itemDescendants.map((descendant) => getDbItemDescendantList(descendantModel, descendant.id, prismaClient)),
          );
        }
      }
    }

    // Construct the ItemDescendantServerOutputType for the current itemModel and dbId
    return {
      ...dbItem,
      itemModel,
      descendantModel,
      descendants: dbDescendants,
    };
  };

  // Use provided transaction or create a new one
  return prismaTransaction
    ? executeLogic(prismaTransaction)
    : prismaClient.$transaction(async (prismaClient) => executeLogic(prismaClient as unknown as PrismaClient));
}

export async function getItemDescendantList(
  itemModel: ItemDescendantModelNameType,
  itemId: StateIdSchemaType,
  prismaTransaction?: PrismaClient,
): Promise<ItemDescendantServerOutputType> {
  const dbItemId = getDbIdFromStateId(itemId);
  const dbItemDescendantList = await getDbItemDescendantList(itemModel, dbItemId, prismaTransaction);
  const parentModel = getParentModel(itemModel);
  const parentId = getStateIdFromDbId(dbItemDescendantList.parentId, parentModel || undefined);

  // Recursively convert all IDs
  let descendants: Array<ItemDescendantServerOutputType> = [];
  const descendantModel = getDescendantModel(itemModel);
  if (descendantModel) {
    descendants = dbItemDescendantList.descendants.map((dbDescendant) => {
      return stateItemDescendantFromDbItemDescendant(dbDescendant, descendantModel);
    });
  }
  const item = {
    ...dbItemDescendantList,
    id: itemId,
    parentId,
    descendants,
  };
  return item;
}

// Recursive function to soft delete an item and all its descendants
function stateItemDescendantFromDbItemDescendant(
  dbItem: ItemDescendantServerOutputType,
  itemModel: ItemDescendantModelNameType,
): ItemDescendantServerOutputType {
  const id = getStateIdFromDbId(dbItem.id, itemModel);
  const parentModel = getParentModel(itemModel);
  const parentId = getStateIdFromDbId(dbItem.parentId, parentModel || undefined);
  let descendants: Array<ItemDescendantServerOutputType> = [];
  // Recursively convert all descendant items
  const descendantModel = getDescendantModel(itemModel);
  if (descendantModel) {
    descendants = dbItem.descendants.map((dbDescendant) => {
      return stateItemDescendantFromDbItemDescendant(dbDescendant, descendantModel);
    });
  }
  const item = {
    ...dbItem,
    id,
    parentId,
    descendantModel,
    descendants,
  };
  return item;
}

/* Not in use
// Recursive function to soft delete an item and all its descendants
export async function softDeleteAndCascadeItem(
  model: ItemDescendantModelNameType,
  itemId: string,
  prismaTransaction?: PrismaClient,
): Promise<void> {
  const executeLogic = async (prismaClient: PrismaClient) => {
    const now = new Date();
    const modelAccessor = getModelAccessor(model, prismaClient);

    // Soft delete the specified item
    await modelAccessor.update({
      where: { id: itemId },
      data: { deletedAt: now },
    });

    // Recursively soft delete all descendant items
    const itemModel = getDescendantModel(model);
    if (itemModel) {
      const itemModelAccessor = getModelAccessor(itemModel, prismaClient);
      const itemsToDelete = await itemModelAccessor.findMany({
        where: { parentId: itemId, deletedAt: null },
      });

      for (const item of itemsToDelete) {
        await softDeleteAndCascadeItem(itemModel, item.id, prismaClient);
      }
    }
  };

  // Use the provided transaction or create a new one if none was provided
  if (prismaTransaction) {
    await executeLogic(prismaTransaction);
  } else {
    await prismaClient.$transaction(async (prismaClient) => {
      await executeLogic(prismaClient as unknown as PrismaClient);
    });
  }
}
*/
