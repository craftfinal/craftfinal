// @/components/itemDescendant/ItemDescendantScaffold.server.tsx

import { getItemDescendantList, getItemsByParentId } from "@/actions/itemDescendant";
import { getCurrentUserIdOrNull } from "@/actions/user";
import { IdSchemaType } from "@/schemas/id";
import {
  ItemDescendantModelNameType,
  getDescendantModel,
  getParentModel,
  itemDescendantModelHierarchy,
} from "@/types/itemDescendant";
import { ResumeActionType } from "@/types/resume";
import { augmentToItemDescendantServerState } from "@/types/utils/itemDescendant";
import ItemDescendantScaffoldClientComponent from "./ItemDescendantScaffold.client";

export interface ItemDescendantScaffoldServerComponentProps {
  itemModel: ItemDescendantModelNameType;
  id?: IdSchemaType;
  resumeAction?: ResumeActionType;
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
        ItemDescendantScaffoldServerComponent(<code>itemModel=&quot;{itemModel}&quot;</code>)
      </h1>
      {levels.length === 0 ? null : (
        <ul>
          {levels.map((level, index) => {
            return (
              <li key={index}>
                {index}: {level.itemModel}: <code className="text-sm">{level.itemId}</code>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default async function ItemDescendantScaffoldServerComponent({
  itemModel,
  id,
  ...props
}: Readonly<ItemDescendantScaffoldServerComponentProps>) {
  const userId = await getCurrentUserIdOrNull();
  if (!userId) {
    throw Error(`ItemDescendantScaffoldServerComponent: Cannot render itemModel=${itemModel}: current user not found`);
  }

  const resumeAction = props.resumeAction ? props.resumeAction : "view";

  // Check if `itemModel` is a valid model
  const validModelName = itemDescendantModelHierarchy.indexOf(itemModel) >= 0;
  if (!validModelName) {
    return (
      <div>
        <p>
          Invalid item model <code className="text-sm">itemModel=&quot;{itemModel}&quot;</code>.
        </p>
        <p>
          Valid models: <code className="text-sm">{itemDescendantModelHierarchy.join(`, `)}</code>
        </p>
      </div>
    );
  }

  let serverOutput,
    levels: Array<Record<string, string>> = [],
    leafItemModel = itemDescendantModelHierarchy[itemDescendantModelHierarchy.length - 1];

  if (id) {
    // If we are at the top level ("user"), we only show a flat list of
    // direct descendants, which are currently using the model "resume"
    if (itemModel === itemDescendantModelHierarchy[0]) {
      leafItemModel = getDescendantModel(itemModel)!;
      console.log(`itemModel=${itemModel} id=${id}`);
      serverOutput = await getItemDescendantList(itemModel, id);
      console.log(`ItemDescendantScaffoldServerComponent: serverOutput:`, serverOutput);
    } else {
      serverOutput = await getItemDescendantList(itemModel, id);
    }
  } else {
    // Otherwise we look for the latest item of the given itemModel
    const targetItemModel = itemModel;
    let derivedItemId: IdSchemaType = userId;

    // Start with a list of resumes owned by the current user
    let derivedItemModel: ItemDescendantModelNameType | null = itemDescendantModelHierarchy[0];
    if (derivedItemModel !== "user") {
      throw Error(
        `ItemDescendantScaffoldServerComponent: invalid initial itemModel=${derivedItemModel}; should be "user"`,
      );
    }
    levels = [{ itemModel: derivedItemModel, itemId: derivedItemId }];

    while (derivedItemModel !== targetItemModel && (derivedItemModel = getDescendantModel(derivedItemModel))) {
      const itemList = await getItemsByParentId(derivedItemModel, derivedItemId);
      if (itemList?.length > 0) {
        derivedItemId = itemList[0].id;
        levels = [...levels, { itemModel: derivedItemModel, itemId: derivedItemId }];
      } else {
        return (
          <>
            <RenderLevels itemModel={targetItemModel} levels={levels} />
            <p>
              Failed to descend to <code>{derivedItemModel}</code>: <code>{getParentModel(derivedItemModel)}</code> with
              id <code>{derivedItemId}</code> has no descendants.
            </p>
          </>
        );
      }
    }

    if (derivedItemModel && derivedItemId) {
      serverOutput = await getItemDescendantList(derivedItemModel, derivedItemId);

      console.log(`ItemDescendantScaffoldServerComponent: serverOutput:`, serverOutput);
    } else {
      throw Error(
        `ItemDescendantScaffoldServerComponent: getItemDescendantList(itemModel=${derivedItemModel}, derivedItemId=${derivedItemId}) returned nothing`,
      );
    }
  }

  const serverState = augmentToItemDescendantServerState(serverOutput, itemModel);

  return !serverState ? null : (
    <>
      <RenderLevels itemModel={itemModel} levels={levels} />
      <ItemDescendantScaffoldClientComponent
        serverState={serverState}
        rootItemModel={itemModel}
        leafItemModel={leafItemModel}
        resumeAction={resumeAction}
      />
    </>
  );
}
