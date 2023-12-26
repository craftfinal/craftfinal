// @/components/itemDescendant/ItemDescendantList.tsx

import { Button } from "@/components/ui/button";
import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { cn } from "@/lib/utils";
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
import DescendantListItem from "./DescendantListItem";
import DescendantListItemInput from "./DescendantListItemInput";

interface DescendantListProps extends ItemDescendantRenderProps {}
export default function DescendantList(props: DescendantListProps) {
  const { className, ancestorChain, rootItemModel, leafItemModel, itemModel, item, resumeAction } = props;

  const canEdit = resumeAction === "edit";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingInput, setEditingInput] = useState(canEdit);

  const isRootItemModel = itemModel === rootItemModel;
  const isLeafItemModel = itemModel === leafItemModel;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inlineInsert, setInlineInsert] = useState(!isRootItemModel && !isLeafItemModel);

  const settingsStore = useAppSettingsStore();
  const { showItemDescendantInternals } = settingsStore.itemDescendant;

  const descendantModel = item.descendantModel;
  const descendantsAreDragable = descendantModel === "achievement";

  const store = useCurrentItemDescendantStore();
  const getDescendants = store((state) => state.getDescendants);
  const reArrangeDescendants = store((state) => state.reArrangeDescendants);
  const resetDescendantsOrderValues = store((state) => state.resetDescendantsOrderValues);
  const setDescendantData = store((state) => state.setDescendantData);
  const markDescendantAsDeleted = store((state) => state.markDescendantAsDeleted);

  const getItems = (): ItemDescendantOrderableStoreStateListType => {
    // window.consoleLog(`DescendantInput:getItems(): ancestorChain=${JSON.stringify(ancestorChain)}`);
    return getDescendants(ancestorChain) as ItemDescendantOrderableStoreStateListType;
  };

  const setItemData = (descendantData: ItemDataUntypedType, clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:setItemData(descendantData=${JSON.stringify(
        descendantData,
        undefined,
        2,
      )}, clientId=${clientId}): ancestorChain=${JSON.stringify(ancestorChain)}`,
    );
    setDescendantData(descendantData, clientId, ancestorChain);
  };

  const markItemAsDeleted = (clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:markItemAsDeleted(clientId=${clientId}): ancestorChain=${JSON.stringify(
        ancestorChain,
        undefined,
        2,
      )}`,
    );
    markDescendantAsDeleted(clientId, ancestorChain);
  };

  const descendants = getItems();

  // Update the state with the new array
  const reArrangeItems = (updatedItemList: ItemDescendantOrderableClientStateListType) => {
    reArrangeDescendants(updatedItemList, ancestorChain);
  };

  const resetItemsOrderValues = () => {
    resetDescendantsOrderValues(ancestorChain);
  };

  const getDescendantDraft = store((state) => state.getDescendantDraft);
  const updateDescendantDraft = store((state) => state.updateDescendantDraft);
  const commitDescendantDraft = store((state) => state.commitDescendantDraft);

  const getItemDraft = (): ItemDataType<ItemClientStateType> => {
    // window.consoleLog(`DescendantInput:getItemDraft(): ancestorChain=${JSON.stringify(ancestorChain)}`);
    return getDescendantDraft(ancestorChain);
  };

  const updateItemDraft = (descendantData: ItemDataUntypedType): void => {
    // window.consoleLog(
    //   `DescendantInput:updateItemDraft(descendantData=${descendantData}): ancestorChain=${JSON.stringify(
    //     ancestorChain,
    //   )}`,
    // );
    updateDescendantDraft(descendantData, ancestorChain);
  };

  const commitItemDraft = (): void => {
    // window.consoleLog(`DescendantInput:commitItemDraft(): ancestorChain=${JSON.stringify(ancestorChain)}`);
    commitDescendantDraft(ancestorChain);
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
      {canEdit && descendantModel === "achievement" && descendants.length > 0 && showItemDescendantInternals ? (
        <div className="flex items-center justify-end px-4">
          <Button
            className="h-4 text-muted-foreground"
            variant="outline"
            size="sm"
            name="resetDescendantsOrderValues"
            onClick={() => {
              resetItemsOrderValues();
            }}
          >
            Reset order
          </Button>
        </div>
      ) : null}
      {/* {canEdit && !inlineInsert ? <DescendantInput {...props} itemModel={descendantModel} /> : null} */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <ul className={cn("bg-elem-light dark:bg-elem-dark-1 flex flex-col overflow-auto", className)}>
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
            <DescendantInput
              {...{ ...props, className: "" }}
              itemModel={descendantModel}
              itemIcon={!descendantsAreDragable}
            />
          ) : null}
        </ul>
      </DndContext>
    </>
  );
}
