// @/app/(authenticated)/item/[root]/[itemId]/[action]/page.tsx

import ItemDescendantList from "@/components/itemDescendant/ItemDescendantList.server";
import { Skeleton } from "@/components/ui/skeleton";
import { StateIdSchemaType, isValidStateId } from "@/schemas/id";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export interface ItemDescendantActionPageProps {
  params: { root: ItemDescendantModelNameType; itemId: StateIdSchemaType };
}

export default async function ItemDescendantActionPage({ params: { root, itemId } }: ItemDescendantActionPageProps) {
  const itemModel = root;
  const resumeAction = "view";

  const validId = isValidStateId(itemId);
  return !itemId || !validId ? (
    notFound()
  ) : (
    <Suspense fallback={<ItemDescendantActionSkeleton />}>
      <ItemDescendantList itemModel={itemModel} itemId={itemId} resumeAction={resumeAction} />
    </Suspense>
  );
}

function ItemDescendantActionSkeleton() {
  return <Skeleton className="border-primary-/20 h-48 w-full border-2 shadow-lg" />;
}
