import ItemDescendantScaffoldServerComponent from "@/components/itemDescendant/scaffold/ItemDescendantScaffold.server";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { Suspense } from "react";

export interface ItemDescendantPageProps {
  params: { root: ItemDescendantModelNameType };
}
export default async function ItemDescendantScaffoldPage({ params: { root } }: ItemDescendantPageProps) {
  const itemModel = root;
  return (
    <Suspense fallback={<ItemDescendantSkeleton />}>
      <ItemDescendantScaffoldServerComponent itemModel={itemModel} />
    </Suspense>
  );
}

function ItemDescendantSkeleton() {
  return <Skeleton className="border-primary-/20 h-48 w-full border-2 shadow-lg" />;
}
