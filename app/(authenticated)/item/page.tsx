// @/app/(authenticated)/item/[action]/page.tsx

import ItemList from "@/components/itemList/ItemList";

export default async function ItemModelIndexPage() {
  const itemModel = "user";
  const resumeAction = "edit";

  return <ItemList itemModel={itemModel} resumeAction={resumeAction} />;
}
