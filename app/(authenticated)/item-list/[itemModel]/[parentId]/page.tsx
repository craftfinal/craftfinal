// @/app/(authenticated)/item-list/[itemModel]/[parentId]/page.tsx

import ItemList, { ItemListProps } from "@/components/itemList/ItemList";

interface ItemListPageProps {
  params: ItemListProps;
}
export default async function ItemListPage({ params: { itemModel, parentId } }: ItemListPageProps) {
  const itemListProps: ItemListProps = {
    itemModel,
    parentId,
    resumeAction: "edit",
  };

  return <ItemList {...itemListProps} />;
}
