// @/app/(authenticated)/item/[action]/page.tsx

import ItemList from "@/components/itemList/ItemList";
import { DbIdSchemaType, dbIdDefault, getStateIdFromDbId } from "@/schemas/id";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { ResumeActionType } from "@/types/resume";

export interface ItemListProps {
  itemModel: ItemDescendantModelNameType;
  parentId: DbIdSchemaType;
  resumeAction: ResumeActionType;
}
export default async function ItemListPage() {
  const userParentId = getStateIdFromDbId(dbIdDefault, "user");
  const itemListProps: ItemListProps = {
    itemModel: "user",
    parentId: userParentId,
    resumeAction: "edit",
  };

  return <ItemList {...itemListProps} />;
}
