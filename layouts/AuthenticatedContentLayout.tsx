// @/components/layout/AuthenticatedContentLayout.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import MainLayout from "@/layouts/MainLayout";
import { User as PrismaUser } from "@prisma/client";
import { ReactNode } from "react";

export interface AuthenticatedContentLayoutChildrenProps {
  user: PrismaUser | null | undefined;
}

export default async function AuthenticatedContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUserOrNull();
  return (
    <MainLayout user={user} className="container">
      {children}
    </MainLayout>
  );
}
