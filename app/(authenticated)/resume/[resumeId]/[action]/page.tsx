// @/app/(authenticated)/resume/[resumeId]/[action]/page.tsx

"use server";

import ItemDescendantList from "@/components/itemDescendant/ItemDescendantList.server";
import { Skeleton } from "@/components/ui/skeleton";
import { StateIdSchemaType } from "@/schemas/id";
import { ResumeActionType } from "@/types/resume";
import { Suspense } from "react";

export interface ItemDescendantActionPageProps {
  params: { resumeId: StateIdSchemaType; action: ResumeActionType };
}

export default async function ItemDescendantActionPage({
  params: { resumeId, action },
}: ItemDescendantActionPageProps) {
  const itemModel = "resume";
  const id = resumeId;

  return (
    <Suspense fallback={<ItemDescendantActionSkeleton />}>
      <ItemDescendantList itemModel={itemModel} itemId={id} resumeAction={action} />
    </Suspense>
  );
}

function ItemDescendantActionSkeleton() {
  return <Skeleton className="border-primary-/20 h-48 w-full border-2 shadow-lg" />;
}
