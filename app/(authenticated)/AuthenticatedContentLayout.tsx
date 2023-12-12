// @/components/layout/AuthenticatedContentLayout.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { User as PrismaUser } from "@prisma/client";
import { ReactNode } from "react";

export interface AuthenticatedContentLayoutChildrenProps {
  user: PrismaUser | null | undefined;
}

export default async function AuthenticatedContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUserOrNull();
  return (
    <>
      <SiteHeader user={user} />
      <main className="container my-auto min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
