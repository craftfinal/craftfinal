// @/components/layout/AuthenticatedContentLayout.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import MainLayout from "@/layouts/MainLayout";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode } from "react";

export interface AuthenticatedContentLayoutChildrenProps {
  user: UserAccountOrNullOrUndefined;
}

export default async function AuthenticatedContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUserOrNull();
  return (
    <MainLayout user={user} className="container">
      {children}
    </MainLayout>
  );
}
