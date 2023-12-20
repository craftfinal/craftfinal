// @/components/itemDescendant/descendant/DescendantInput.tsx

import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
// import { useState } from "react";
import { ItemClientStateType, ItemDataType, ItemDataUntypedType } from "@/schemas/item";
// import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { useState } from "react";
import { ItemDescendantRenderProps } from "../ItemDescendantList.client";
import { ItemIcon } from "../utils/ItemIcon";
import DescendantListItemInput from "./DescendantListItemInput";

export default function DescendantInput(props: ItemDescendantRenderProps) {
  const { ancestorClientIdChain, /*inputFieldIndex, */ item, itemModel, resumeAction } = props;
  const canEdit = resumeAction === "edit";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingInput, setEditingInput] = useState(canEdit);

  // const settingsStore = useAppSettingsStore();
  // const { showItemDescendantIdentifiers } = settingsStore;
  // const showIdentifiers = process.env.NODE_ENV === "development" && showItemDescendantIdentifiers;

  const storeName = useStoreName();
  const store = useItemDescendantStore(storeName);
  const getDescendantDraft = store((state) => state.getDescendantDraft);
  const updateDescendantDraft = store((state) => state.updateDescendantDraft);
  const commitDescendantDraft = store((state) => state.commitDescendantDraft);

  const getItemDraft = (): ItemDataType<ItemClientStateType> => {
    // window.consoleLog(`DescendantInput:getItemDraft(): ancestorClientIdChain=${JSON.stringify(ancestorClientIdChain)}`);
    return getDescendantDraft(ancestorClientIdChain);
  };

  const updateItemDraft = (descendantData: ItemDataUntypedType): void => {
    // window.consoleLog(`DescendantInput:updateItemDraft(descendantData=${descendantData}): ancestorClientIdChain=${JSON.stringify(ancestorClientIdChain)}`);
    updateDescendantDraft(descendantData, ancestorClientIdChain);
  };

  const commitItemDraft = (): void => {
    // window.consoleLog(`DescendantInput:commitItemDraft(): ancestorClientIdChain=${JSON.stringify(ancestorClientIdChain)}`,);
    commitDescendantDraft(ancestorClientIdChain);
  };

  const itemDraft = getItemDraft();

  return (
    <div key={item.clientId} className="flex items-center gap-1 lg:gap-2 xl:gap-3">
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
