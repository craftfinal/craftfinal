// @/app/(authenticated)/resume/[resumeId]/page.tsx

import ItemDescendantList from "@/components/itemDescendant/ItemDescendantList.server";
import { Skeleton } from "@/components/ui/skeleton";
import { StateIdSchemaType } from "@/schemas/id";
import { Suspense } from "react";

export interface ItemDescendantActionPageProps {
  params: { resumeId: StateIdSchemaType };
}

export default async function ItemDescendantActionPage({ params: { resumeId } }: ItemDescendantActionPageProps) {
  const itemModel = "resume";
  const id = resumeId;
  const resumeAction = "view";

  return (
    <Suspense fallback={<ItemDescendantActionSkeleton />}>
      <ItemDescendantList itemModel={itemModel} itemId={id} resumeAction={resumeAction} />
    </Suspense>
  );
}

function ItemDescendantActionSkeleton() {
  return <Skeleton className="border-primary-/20 h-48 w-full border-2 shadow-lg" />;
}
