// @/components/itemDescendant/ItemDescendantList.tsx

import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import { ItemClientStateType, ItemDataType, ItemDataUntypedType } from "@/schemas/item";
import {
  ItemDescendantClientStateType,
  ItemDescendantOrderableClientStateListType,
  ItemDescendantOrderableClientStateType,
  ItemDescendantOrderableStoreStateListType,
} from "@/schemas/itemDescendant";
import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { ClientIdType } from "@/types/item";
import { findItemIndexByClientId } from "@/types/utils/itemDescendant";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { ItemDescendantRenderProps } from "../ItemDescendantList.client";
import ItemDescendantSortableWrapper from "../utils/ItemDescendantSortableWrapper";
import DescendantInput from "./DescendantInput";
import DescendantListItemInput from "./DescendantListItemInput";
import DescendantListItem from "./DescendantListItem";

interface DescendantListProps extends ItemDescendantRenderProps {}
export default function DescendantList(props: DescendantListProps) {
  const { ancestorClientIdChain, rootItemModel, leafItemModel, itemModel, item, resumeAction } = props;

  const canEdit = resumeAction === "edit";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingInput, setEditingInput] = useState(canEdit);

  const isRootItemModel = itemModel === rootItemModel;
  const isLeafItemModel = itemModel === leafItemModel;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inlineInsert, setInlineInsert] = useState(!isRootItemModel && !isLeafItemModel);

  const settingsStore = useAppSettingsStore();
  const { showItemDescendantInternals } = settingsStore;
  const showListItemInternals = process.env.NODE_ENV === "development" && showItemDescendantInternals;

  const descendantModel = item.descendantModel;
  const descendantsAreDragable = descendantModel === "achievement";

  const storeName = useStoreName();
  const store = useItemDescendantStore(storeName);

  const getDescendants = store((state) => state.getDescendants);
  const reArrangeDescendants = store((state) => state.reArrangeDescendants);
  const resetDescendantsOrderValues = store((state) => state.resetDescendantsOrderValues);
  const setDescendantData = store((state) => state.setDescendantData);
  const markDescendantAsDeleted = store((state) => state.markDescendantAsDeleted);

  const getItems = (): ItemDescendantOrderableStoreStateListType => {
    // window.consoleLog(`DescendantInput:getItems(): ancestorClientIdChain=${JSON.stringify(ancestorClientIdChain)}`);
    return getDescendants(ancestorClientIdChain) as ItemDescendantOrderableStoreStateListType;
  };

  const setItemData = (descendantData: ItemDataUntypedType, clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:setItemData(descendantData=${JSON.stringify(
        descendantData,
        undefined,
        2,
      )}, clientId=${clientId}): ancestorClientIdChain=${JSON.stringify(ancestorClientIdChain)}`,
    );
    setDescendantData(descendantData, clientId, ancestorClientIdChain);
  };

  const markItemAsDeleted = (clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:markItemAsDeleted(clientId=${clientId}): ancestorClientIdChain=${JSON.stringify(
        ancestorClientIdChain,
        undefined,
        2,
      )}`,
    );
    markDescendantAsDeleted(clientId, ancestorClientIdChain);
  };

  const descendants = getItems();

  // Update the state with the new array
  const reArrangeItems = (updatedItemList: ItemDescendantOrderableClientStateListType) => {
    reArrangeDescendants(updatedItemList, ancestorClientIdChain);
  };

  const resetItemsOrderValues = () => {
    resetDescendantsOrderValues(ancestorClientIdChain);
  };

  const getDescendantDraft = store((state) => state.getDescendantDraft);
  const updateDescendantDraft = store((state) => state.updateDescendantDraft);
  const commitDescendantDraft = store((state) => state.commitDescendantDraft);

  const getItemDraft = (): ItemDataType<ItemClientStateType> => {
    // window.consoleLog(`DescendantInput:getItemDraft(): ancestorClientIdChain=${JSON.stringify(ancestorClientIdChain)}`);
    return getDescendantDraft(ancestorClientIdChain);
  };

  const updateItemDraft = (descendantData: ItemDataUntypedType): void => {
    // window.consoleLog(
    //   `DescendantInput:updateItemDraft(descendantData=${descendantData}): ancestorClientIdChain=${JSON.stringify(
    //     ancestorClientIdChain,
    //   )}`,
    // );
    updateDescendantDraft(descendantData, ancestorClientIdChain);
  };

  const commitItemDraft = (): void => {
    // window.consoleLog(`DescendantInput:commitItemDraft(): ancestorClientIdChain=${JSON.stringify(ancestorClientIdChain)}`);
    commitDescendantDraft(ancestorClientIdChain);
  };

  const itemDraft = getItemDraft();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over!.id) {
      const activeIndex = findItemIndexByClientId(descendants, active.id as string);
      const overIndex = findItemIndexByClientId(descendants, over!.id as string);

      // Return a new array
      const updatedDescendants = descendants.map(
        (descendant: ItemDescendantOrderableClientStateType, index: number) => {
          if (index === activeIndex || index === overIndex) {
            return { ...descendant };
          }
          return descendant;
        },
      );

      // Update the state with the new array
      reArrangeItems(arrayMove(updatedDescendants, activeIndex, overIndex));
    }
  };

  return !descendantModel ? null : (
    <>
      {canEdit && descendantModel === "achievement" && showListItemInternals ? (
        <button
          className="rounded-md border-2 px-1 text-primary"
          name="resetDescendantsOrderValues"
          onClick={() => {
            resetItemsOrderValues();
          }}
        >
          Reset order
        </button>
      ) : null}
      {/* {canEdit && !inlineInsert ? <DescendantInput {...props} itemModel={descendantModel} /> : null} */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <ul className="bg-elem-light dark:bg-elem-dark-1 flex flex-col overflow-auto">
          {canEdit && inlineInsert ? (
            <DescendantListItemInput
              itemModel={descendantModel}
              itemDraft={itemDraft}
              updateItemDraft={updateItemDraft}
              commitItemDraft={commitItemDraft}
              editingInput={editingInput}
              // setEditingInput={setEditingInput}
              canEdit={canEdit}
            />
          ) : null}
          <ItemDescendantSortableWrapper items={descendants} disabled={!descendantsAreDragable}>
            {descendants.map((item: ItemDescendantClientStateType, index: number) => {
              return (
                <DescendantListItem
                  {...props}
                  key={item.clientId}
                  index={index}
                  rootItemModel={rootItemModel}
                  itemModel={descendantModel}
                  itemIcon={!canEdit}
                  item={item as ItemDescendantClientStateType}
                  setItemData={setItemData}
                  resumeAction={resumeAction}
                  markItemAsDeleted={markItemAsDeleted}
                  itemIsDragable={descendantsAreDragable}
                  canEdit={canEdit}
                />
              );
            })}
          </ItemDescendantSortableWrapper>
          {canEdit && !inlineInsert ? (
            <DescendantInput {...props} itemModel={descendantModel} itemIcon={!descendantsAreDragable} />
          ) : null}
        </ul>
      </DndContext>
    </>
  );
}
