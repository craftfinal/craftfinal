// @/components/itemDescendant/ItemDescendantItem.tsx

import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import { ItemDataUntypedType } from "@/schemas/item";
import { ClientIdType } from "@/types/item";
import { ItemDescendantRenderProps } from "../ItemDescendantList.client";
import DescendantListItem from "./DescendantListItem";

import { GrAchievement, GrUserManager } from "react-icons/gr";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

export const itemModelIcon = {
  organization: HiOutlineBuildingLibrary,
  role: GrUserManager,
  achievement: GrAchievement,
};
export type ItemModelIconKeyType = keyof typeof itemModelIcon;
export function renderIcon(itemModel: ItemModelIconKeyType, props: React.SVGProps<SVGSVGElement>) {
  const IconComponent = itemModelIcon[itemModel];
  return IconComponent ? <IconComponent {...props} /> : null;
}

export default function Descendant(props: ItemDescendantRenderProps) {
  const { ancestorClientIdChain, itemModel, index, resumeAction } = props;
  // const [editingInput, setEditingInput] = useState(resumeAction === "edit");
  const storeName = useStoreName();
  const store = useItemDescendantStore(storeName);
  const setDescendantData = store((state) => state.setDescendantData);
  const markDescendantAsDeleted = store((state) => state.markDescendantAsDeleted);

  const setItemData = (descendantData: ItemDataUntypedType, clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:setItemData(descendantData=${descendantData}): ancestorClientIdChain=${JSON.stringify(
        ancestorClientIdChain,
      )}`,
    );
    setDescendantData(descendantData, clientId, ancestorClientIdChain);
  };

  const markItemAsDeleted = (clientId: ClientIdType): void => {
    window.consoleLog(
      `Descendant:markDescendantAsDeleted(clientId=${clientId}): parentItem=${JSON.stringify(ancestorClientIdChain)}`,
    );
    markDescendantAsDeleted(clientId, ancestorClientIdChain);
  };

  const canEdit = itemModel === "user" ? false : resumeAction === "edit";

  return (
    <div className="flex items-center gap-1 lg:gap-2 xl:gap-3">
      {renderIcon(itemModel as ItemModelIconKeyType, {
        className: "w-auto text-foreground h-4 sm:h-6 lg:h-6 xl:h-8",
      })}{" "}
      {/* Render icon with className */}
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
