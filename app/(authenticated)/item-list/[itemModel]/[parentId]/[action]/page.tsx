// @/app/(authenticated)/item-list/[itemModel]/[parentId]/[action]/page.tsx

import ItemList, { ItemListProps } from "@/components/itemList/ItemList";

interface ItemListPageProps {
  params: ItemListProps;
}
export default async function ItemListPage({ params: itemListProps }: ItemListPageProps) {
  return <ItemList {...itemListProps} />;
}
