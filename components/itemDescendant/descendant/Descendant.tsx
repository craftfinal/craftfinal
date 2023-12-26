// @/components/itemDescendant/ItemDescendantItem.tsx

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { cn } from "@/lib/utils";
import { ItemDataUntypedType } from "@/schemas/item";
import { ClientIdType } from "@/types/item";
import { ItemDescendantRenderProps } from "../ItemDescendantList.client";
import DescendantListItem from "./DescendantListItem";

export default function Descendant(props: ItemDescendantRenderProps) {
  const { className, ancestorChain, itemModel, index, resumeAction } = props;
  // const [editingInput, setEditingInput] = useState(resumeAction === "edit");
  const store = useCurrentItemDescendantStore();
  const setDescendantData = store((state) => state.setDescendantData);
  const markDescendantAsDeleted = store((state) => state.markDescendantAsDeleted);

  const setItemData = (descendantData: ItemDataUntypedType, clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:setItemData(descendantData=${descendantData}): ancestorChain=${JSON.stringify(ancestorChain)}`,
    );
    setDescendantData(descendantData, clientId, ancestorChain);
  };

  const markItemAsDeleted = (clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:markDescendantAsDeleted(clientId=${clientId}): parentItem=${JSON.stringify(ancestorChain)}`,
    );
    markDescendantAsDeleted(clientId, ancestorChain);
  };

  const canEdit = itemModel === "user" ? false : resumeAction === "edit";

  return (
    <div className={cn("flex items-center gap-1 lg:gap-2 xl:gap-3", className)}>
      <DescendantListItem
        {...props}
        asChild={true}
        index={index}
        setItemData={setItemData}
        markItemAsDeleted={markItemAsDeleted}
        itemIsDragable={false}
        canEdit={canEdit}
      />
    </div>
  );
}
