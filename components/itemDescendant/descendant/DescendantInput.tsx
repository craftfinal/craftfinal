// @/components/itemDescendant/descendant/DescendantInput.tsx

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
// import { useState } from "react";
import { ItemClientStateType, ItemDataType, ItemDataUntypedType } from "@/schemas/item";
// import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ItemDescendantRenderProps } from "../ItemDescendantList.client";
import { ItemIcon } from "../utils/ItemIcon";
import DescendantListItemInput from "./DescendantListItemInput";

export default function DescendantInput(props: ItemDescendantRenderProps) {
  const { className, ancestorChain, /*inputFieldIndex, */ item, itemModel, resumeAction } = props;
  const canEdit = resumeAction === "edit";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingInput, setEditingInput] = useState(canEdit);

  // const settingsStore = useAppSettingsStore();
  // const { showItemDescendantIdentifiers } = settingsStore;
  // const showIdentifiers = process.env.NODE_ENV === "development" && showItemDescendantIdentifiers;

  const store = useCurrentItemDescendantStore();
  const getDescendantDraft = store((state) => state.getDescendantDraft);
  const updateDescendantDraft = store((state) => state.updateDescendantDraft);
  const commitDescendantDraft = store((state) => state.commitDescendantDraft);

  const getItemDraft = (): ItemDataType<ItemClientStateType> => {
    // window.consoleLog(`DescendantInput:getItemDraft(): ancestorChain=${JSON.stringify(ancestorChain)}`);
    return getDescendantDraft(ancestorChain);
  };

  const updateItemDraft = (descendantData: ItemDataUntypedType): void => {
    // window.consoleLog(`DescendantInput:updateItemDraft(descendantData=${descendantData}): ancestorChain=${JSON.stringify(ancestorChain)}`);
    updateDescendantDraft(descendantData, ancestorChain);
  };

  const commitItemDraft = (): void => {
    // window.consoleLog(`DescendantInput:commitItemDraft(): ancestorChain=${JSON.stringify(ancestorChain)}`,);
    commitDescendantDraft(ancestorChain);
  };

  const itemDraft = getItemDraft();

  return (
    <div key={item.clientId} className={cn("flex items-center gap-1 lg:gap-2 xl:gap-3", className)}>
      {!canEdit ? null : ItemIcon(itemModel)}
      <DescendantListItemInput
        itemModel={itemModel}
        itemDraft={itemDraft}
        updateItemDraft={updateItemDraft}
        commitItemDraft={commitItemDraft}
        editingInput={editingInput}
        // setEditingInput={setEditingInput}
        canEdit={canEdit}
      />
    </div>
  );
}
