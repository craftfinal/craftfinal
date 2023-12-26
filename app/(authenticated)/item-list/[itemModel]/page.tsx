// @/app/(authenticated)/item/[action]/page.tsx

import ItemList, { ItemListProps } from "@/components/itemList/ItemList";

interface ItemListPageProps {
  params: ItemListProps;
}
export default async function ItemListPage({ params: { itemModel } }: ItemListPageProps) {
  const itemListProps: ItemListProps = {
    itemModel,
    resumeAction: "edit",
  };

  return <ItemList {...itemListProps} />;
}
