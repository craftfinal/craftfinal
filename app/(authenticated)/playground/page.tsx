// @/app/(authenticated)/itemDescendant/[root]/page.tsx

"use server";

import ItemDescendantList from "@/components/itemDescendant/ItemDescendantList.server";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function PlaygroundPage() {
  const itemModel = "user";
  const resumeAction = "edit";
  return (
    <Suspense fallback={<PlaygroundSkeleton />}>
      <ItemDescendantList itemModel={itemModel} resumeAction={resumeAction} />
    </Suspense>
  );
}

function PlaygroundSkeleton() {
  return <Skeleton className="border-primary-/20 h-48 w-full border-2 shadow-lg" />;
}
