// @/components/itemDescendant/ItemDescendant.server.tsx

import { getItemById } from "@/actions/itemDescendant";
import { getCurrentUserIdOrNull } from "@/actions/user";
import { siteNavigation } from "@/config/navigation";
import { prismaClient } from "@/prisma/client";
import {
  StateIdSchemaType,
  getDbIdAndModelFromStateId,
  getStateIdFromDbId,
  isValidDbId,
  isValidStateId,
} from "@/schemas/id";
import {
  ItemDescendantServerOutputType,
  ItemDescendantServerStateType,
  itemDescendantServerOutputSchema,
} from "@/schemas/itemDescendant";
import { ItemDescendantModelNameType, getModelAccessor, itemDescendantModelHierarchy } from "@/types/itemDescendant";
import { ResumeActionType, resumeActionTypes } from "@/types/resume";
import { augmentToItemDescendantServerState, isValidModelName } from "@/types/utils/itemDescendant";
import { notFound, redirect } from "next/navigation";

function redirectInvalidRequest() {
  redirect(siteNavigation.itemRoot.href);
}

export interface ItemProps {
  itemModel: ItemDescendantModelNameType;
  itemId: StateIdSchemaType;
  resumeAction?: ResumeActionType;
}
export default async function Item({ itemModel, itemId, ...props }: Readonly<ItemProps>) {
  // This component is only available in `development`
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  const logPrefix = `Item(itemModel=${itemModel}, itemId=${itemId})`;

  let serverState: ItemDescendantServerStateType, resumeAction: ResumeActionType;

  try {
    const userId = await getCurrentUserIdOrNull();
    if (!userId || !isValidStateId(userId)) {
      console.error(logPrefix, `current user not found; redirecting to itemRoot`);
      redirectInvalidRequest();
    }
    const validUserId: StateIdSchemaType = userId!;

    // Check if `itemModel` is a valid model
    if (!(itemDescendantModelHierarchy.indexOf(itemModel) >= 0)) {
      console.error(logPrefix, `invalid itemModel=${itemModel} not found in ${itemDescendantModelHierarchy}`);
      redirectInvalidRequest();
    }
    const validModelName = itemModel;

    resumeAction =
      props.resumeAction && resumeActionTypes.indexOf(props.resumeAction) >= 0 ? props.resumeAction : "view";

    const serverOutput = await getItemFromProps(validUserId, itemId, validModelName);
    serverState = augmentToItemDescendantServerState(serverOutput.itemDescendant, itemModel);
  } catch (error) {
    console.error(logPrefix, error);
    throw error;
  }

  return !serverState ? null : (
    <>
      <p>
        rootItemModel={itemModel}
        resumeAction={resumeAction}
      </p>
      <pre>{JSON.stringify(serverState)}</pre>
    </>
  );
}

async function getItemFromProps(
  userId: StateIdSchemaType,
  itemId: StateIdSchemaType,
  itemModel?: ItemDescendantModelNameType,
) {
  let validModelName: ItemDescendantModelNameType, itemDbId;
  const logPrefix = `Item(itemModel=${itemModel}, itemId=${itemId}).getItemFromProps`;

  // `itemId` is either a dbId or a stateId
  if (isValidDbId(itemId)) {
    if (!isValidModelName(itemModel)) {
      throw Error(logPrefix + `: invalid itemModel="${itemModel}"`);
    }
    validModelName = itemModel!;
    itemDbId = itemId;
    throw Error(logPrefix + `: invalid itemModel="${itemModel}"`);
  } else if (isValidStateId(itemId)) {
    const { dbId, model: dbModel } = getDbIdAndModelFromStateId(itemId);
    if (!isValidModelName(dbModel as ItemDescendantModelNameType)) {
      throw Error(logPrefix + `: invalid itemModel="${itemModel}"`);
    }
    if (itemModel) {
      // Validate if the model encoded in itemId matches `itemModel`
      if (dbModel !== itemModel) {
        throw Error(logPrefix + `: itemModel=${itemModel} != ${dbModel}=dbModel from itemId=${itemId}`);
      }
    }
    validModelName = dbModel as ItemDescendantModelNameType;
    itemDbId = dbId;
  } else {
    throw Error(logPrefix + `: invalid itemId="${itemId}"`);
  }

  const itemStateId = getStateIdFromDbId(itemDbId, validModelName);
  const itemModelAccessor = getModelAccessor(validModelName, prismaClient);
  const item: ItemDescendantServerOutputType = (await getItemById(
    itemModelAccessor,
    validModelName,
    itemStateId,
  )) as ItemDescendantServerOutputType;
  if (!item || !itemDescendantServerOutputSchema.parse(item)) {
    throw Error(logPrefix + `: invalid item=${item}`);
  }
  // console.log(`Item: itemDescendant:`, itemDescendant);
  return { itemDescendant: item };
}
