// @/components/itemDescendant/ItemDescendant.server.tsx

import { getItemDescendantList, getItemsByParentId } from "@/actions/itemDescendant";
import { getCurrentUserIdOrNull } from "@/actions/user";
import { siteNavigation } from "@/config/navigation";
import { StateIdSchemaType, getDbIdAndModelFromStateId, getDbIdFromStateId, isValidStateId } from "@/schemas/id";
import { ItemDescendantServerOutputType, itemDescendantServerOutputSchema } from "@/schemas/itemDescendant";
import { ItemDescendantModelNameType, getDescendantModel, itemDescendantModelHierarchy } from "@/types/itemDescendant";
import { ResumeActionType } from "@/types/resume";
import { augmentToItemDescendantServerState } from "@/types/utils/itemDescendant";
import { notFound, redirect } from "next/navigation";
import ItemDescendantListContext from "./ItemDescendantList.client";

function redirectInvalidRequest() {
  redirect(siteNavigation.antePlayground.href);
}

export interface ItemDescendantListProps {
  itemModel: ItemDescendantModelNameType;
  itemId?: StateIdSchemaType;
  resumeAction?: ResumeActionType;
}
export default async function ItemDescendantList({ itemModel, itemId, ...props }: Readonly<ItemDescendantListProps>) {
  let serverState, resumeAction: ResumeActionType, leafItemModel: ItemDescendantModelNameType;
  const levels: Array<Record<string, string>> = [];
  const renderLevels = false;
  const devel = process.env.NODE_ENV === "development";
  try {
    const userId = await getCurrentUserIdOrNull();
    if (!userId || !isValidStateId(userId)) {
      // console.error(`ItemDescendantServerComponent: current user not found; redirecting to playground`);
      redirectInvalidRequest();
    }
    const validUserId: StateIdSchemaType = userId!;

    resumeAction = props.resumeAction ?? (itemModel === itemDescendantModelHierarchy[0] ? "edit" : "view");

    // Check if `itemModel` is a valid model
    if (!(itemDescendantModelHierarchy.indexOf(itemModel) >= 0)) {
      console.error(`ItemDescendantList: invalid itemModel=${itemModel} not found in ${itemDescendantModelHierarchy}`);
      redirectInvalidRequest();
    }
    const validModelName = itemModel;

    let serverOutput;
    if (devel) {
      serverOutput = await getItemDescendantFromProps(validUserId, validModelName, itemId);
    } else {
      serverOutput = await getItemDescendantFromProps(validUserId, validModelName, itemId);
    }
    serverState = augmentToItemDescendantServerState(serverOutput.itemDescendant, itemModel);
    leafItemModel = serverOutput.leafItemModel;
  } catch (exc) {
    if (devel) {
      throw exc;
    } else {
      notFound();
    }
  }

  return !serverState ? null : (
    <>
      {renderLevels && <RenderLevels itemModel={itemModel} levels={levels} />}
      <ItemDescendantListContext
        serverState={serverState}
        rootItemModel={itemModel}
        leafItemModel={leafItemModel}
        resumeAction={resumeAction}
      />
    </>
  );
}

async function getItemDescendantFromProps(
  userId: StateIdSchemaType,
  itemModel: ItemDescendantModelNameType,
  itemId?: StateIdSchemaType,
) {
  let rootItemId: StateIdSchemaType | undefined = itemId;
  let leafItemModel: ItemDescendantModelNameType;

  // If we are at the top level ("user"), we only show a flat list of
  // direct descendants, which are currently using the model "resume"
  if (itemModel === itemDescendantModelHierarchy[0]) {
    rootItemId = userId;
    leafItemModel = getDescendantModel(itemModel)!;
    console.log(
      `ItemDescendantList: itemModel=${itemModel} itemId=${rootItemId}: ${itemModel} is root of hierarchy; set leafItemModel=${leafItemModel}`,
    );
  } else {
    // The lowest level of items is the second last, as the item still has descendants,
    // which will correspond to the lowest level
    leafItemModel = itemDescendantModelHierarchy[itemDescendantModelHierarchy.length - 1];
  }

  if (!rootItemId) {
    throw Error(
      `ItemDescendantList/getServerOutputForProduction: when itemModel=${itemModel}, itemId=${itemId} must be a valid stateId`,
    );
  }

  const { dbId: itemDbId, model: dbModel } = getDbIdAndModelFromStateId(rootItemId);
  if (dbModel !== itemModel) {
    throw Error(
      `ItemDescendantList/getServerOutputForProduction: itemModel=${itemModel} != ${dbModel}=dbModel from itemId=${itemId}`,
    );
  }

  // Ensure that we only return items that belong to the userId
  if (rootItemId !== userId) {
    const secondModel = itemDescendantModelHierarchy[1];
    const itemsOwnedByUser = await getItemsByParentId(secondModel, userId);
    const userOwnedItem = itemsOwnedByUser.find((item) => item.id === itemId);

    if (!userOwnedItem) {
      if (process.env.NODE_ENV === "development") {
        throw Error(
          `ItemDescendantList/getServerOutputForProduction: ` +
            `could not find itemDbId=${itemDbId} among the descendants of userDbId=${getDbIdFromStateId(
              userId,
            )}; secondModel=${secondModel}`,
        );
      }
      notFound();
    }
  }

  const itemDescendant: ItemDescendantServerOutputType = await getItemDescendantList(itemModel, rootItemId);
  if (!itemDescendant || !itemDescendantServerOutputSchema.parse(itemDescendant)) {
    throw Error(`ItemDescendantList/getServerOutputForProduction: invalid itemDescendant=${itemDescendant}`);
  }
  // console.log(`ItemDescendantList: itemDescendant:`, itemDescendant);
  return { itemDescendant, leafItemModel };
}

async function RenderLevels({
  itemModel,
  levels,
}: Readonly<{
  itemModel: ItemDescendantModelNameType;
  levels: Array<Record<string, string>>;
}>) {
  return (
    <>
      <h1>
        ItemDescendantServerComponent(<code>itemModel=&quot;{itemModel}&quot;</code>)
      </h1>
      {levels.length === 0 ? null : (
        <ul>
          {levels.map((level, index) => {
            return (
              <li key={level.itemId}>
                {index}: {level.itemModel}: <code className="text-sm">{level.itemId}</code>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
