// @/components/itemList/ItemDescendant.server.tsx

import { getItemsByParentId } from "@/actions/itemDescendant";
import { getCurrentUserIdOrNull } from "@/actions/user";
import { siteNavigation } from "@/config/navigation";
import {
  DbIdSchemaType,
  StateIdSchemaType,
  dbIdDefault,
  generateClientId,
  getDbIdAndModelFromStateId,
  getStateIdFromDbId,
  isValidDbId,
  isValidStateId,
} from "@/schemas/id";
import { ItemServerOutputType } from "@/schemas/item";
import { ItemDescendantClientStateType } from "@/schemas/itemDescendant";
import { ItemDisposition } from "@/types/item";
import {
  ItemDescendantModelNameType,
  getDescendantModel,
  getParentModel,
  itemDescendantModelHierarchy,
} from "@/types/itemDescendant";
import { ResumeActionType, resumeActionTypes } from "@/types/resume";
import { isValidModelName } from "@/types/utils/itemDescendant";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import { RenderItemListClient } from "./RenderItemListClient";

function redirectInvalidRequest() {
  redirect(siteNavigation.itemRoot.href);
}

export interface ItemListProps {
  itemModel?: ItemDescendantModelNameType;
  parentId?: StateIdSchemaType;
  resumeAction?: ResumeActionType;
}
export default async function ItemList(itemListProps: Readonly<ItemListProps>) {
  // This component is only available in `development`
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return (
    <Suspense fallback={<ItemListSkeleton {...itemListProps} />}>
      <RenderItemList {...itemListProps} />
    </Suspense>
  );
}

async function RenderItemList({ itemModel, parentId, ...props }: Readonly<ItemListProps>) {
  const logPrefix = `RenderItemList(itemModel=${itemModel}, parentId=${parentId})`;

  let validParentId: StateIdSchemaType, validItemModel: ItemDescendantModelNameType;
  let resumeAction: ResumeActionType;

  let clientStateList: Array<ItemDescendantClientStateType>;

  try {
    const userId = await getCurrentUserIdOrNull();
    if (!userId || !isValidStateId(userId)) {
      console.error(logPrefix, `current user not found; redirecting to itemRoot`);
      redirectInvalidRequest();
    }

    // Check if `itemModel` is a valid model
    if (!itemModel || !(itemDescendantModelHierarchy.indexOf(itemModel) >= 0)) {
      console.error(logPrefix, `invalid itemModel=${itemModel} not found in ${itemDescendantModelHierarchy}`);
      redirectInvalidRequest();
    }
    validItemModel = itemModel!;

    if (parentId) {
      if (isValidStateId(parentId)) {
        validParentId = parentId!;
      } else {
        throw Error(logPrefix + `: invalid parentId: ${parentId}`);
      }
    } else if (itemDescendantModelHierarchy.indexOf(validItemModel) === 0) {
      validParentId = getStateIdFromDbId(dbIdDefault, validItemModel);
    } else if (itemDescendantModelHierarchy.indexOf(validItemModel) === 1) {
      validParentId = userId!;
    } else {
      throw Error(
        logPrefix + `: missing parentId: ${parentId} for itemModel=${itemModel} !== ${itemDescendantModelHierarchy[1]}`,
      );
    }

    resumeAction =
      props.resumeAction && resumeActionTypes.indexOf(props.resumeAction) >= 0 ? props.resumeAction : "view";

    const serverOutput = await getItemListFromProps(validParentId, validItemModel);
    clientStateList = augmentItemDescendantListToClientState(serverOutput, validItemModel);
  } catch (error) {
    console.error(logPrefix, error);
    throw error;
  }

  const className = "";
  return !clientStateList ? null : (
    <>
      <Table className={className}>
        <TableBody className="text-xs">
          <TableRow>
            <TableHead className="h-auto font-bold">itemModel</TableHead>
            <TableCell>
              <span className="font-medium">{validItemModel}</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="h-auto font-bold">parentId</TableHead>
            <TableCell>
              <span className="font-medium">{validParentId}</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="h-auto font-bold">resumeAction</TableHead>
            <TableCell>
              <span className="font-medium">{resumeAction}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <RenderItemListClient itemList={clientStateList} />
    </>
  );
}

export function augmentItemDescendantListToClientState(
  serverOutput: Array<ItemServerOutputType>,
  itemModel: ItemDescendantModelNameType,
  disposition?: ItemDisposition,
): Array<ItemDescendantClientStateType> {
  const clientStateList = serverOutput.map((serverItem) => {
    return {
      ...serverItem,
      clientId: generateClientId(getParentModel(itemModel) ?? undefined),
      parentId: generateClientId(itemModel),
      disposition: disposition ?? ItemDisposition.Initial,
      itemModel,
      descendantModel: getDescendantModel(itemModel),
      descendants: [],
    } as ItemDescendantClientStateType;
  });
  return clientStateList;
}

async function getItemListFromProps(
  parentId: StateIdSchemaType | DbIdSchemaType,
  itemModel?: ItemDescendantModelNameType,
): Promise<Array<ItemServerOutputType>> {
  let validModelName: ItemDescendantModelNameType;
  let validParentId: StateIdSchemaType = parentId;
  const logPrefix = `ItemList(itemModel=${itemModel}, parentId=${parentId}).getItemListFromProps`;

  // `parentId` must either be a dbId or a stateId
  if (isValidDbId(parentId)) {
    if (!isValidModelName(itemModel)) {
      throw Error(logPrefix + `: invalid itemModel="${itemModel}"`);
    }
    validModelName = itemModel!;
    validParentId = getStateIdFromDbId(parentId, validModelName);
  } else if (isValidStateId(validParentId)) {
    const { model: dbModel } = getDbIdAndModelFromStateId(parentId);
    if (!isValidModelName(dbModel as ItemDescendantModelNameType)) {
      throw Error(logPrefix + `: invalid dbModel="${dbModel}" from parentId=${parentId}`);
    }
    if (itemModel) {
      const modelIndex = itemDescendantModelHierarchy.indexOf(itemModel);
      if (modelIndex < 0) {
        throw Error(logPrefix + `: invalid itemModel="${itemModel}"`);
      } else if (modelIndex > 0) {
        const parentModel = getParentModel(itemModel);
        // Validate if the model encoded in parentId matches `itemModel`
        if (dbModel !== parentModel) {
          throw Error(logPrefix + `: parentModel=${parentModel} != ${dbModel}=dbModel from parentId=${parentId}`);
        }
      }
    }
    validModelName = itemModel!;
    validParentId = parentId;
  } else {
    throw Error(logPrefix + `: invalid parentId="${parentId}"`);
  }

  // const itemModelAccessor = getModelAccessor(validModelName, prismaClient);
  const itemList: Array<ItemServerOutputType> = await getItemsByParentId(validModelName, validParentId);
  if (!itemList) {
    throw Error(logPrefix + `: invalid itemList=${itemList}`);
  }
  return itemList;
}

function ItemListSkeleton(props: ItemListProps) {
  if (props.resumeAction === "view") {
    return <Skeleton className="border-primary-/20 h-0.5 w-full border-2 shadow-lg" />;
  } else {
    <Skeleton className="border-primary-/20 h-0.5 w-full border-2 shadow-lg" />;
  }
}
