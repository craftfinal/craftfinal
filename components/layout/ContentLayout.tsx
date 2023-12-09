// @/components/layout/MarketingContentLayout.tsx

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { User as PrismaUser } from "@prisma/client";
import { PropsWithChildren } from "react";

export interface ContentLayoutChildrenProps {
  user: PrismaUser | null;
}

interface ContentLayoutProps extends PropsWithChildren {}
export default async function ContentLayout({ children }: Readonly<ContentLayoutProps>) {
  const user = undefined;
  return (
    <>
      <SiteHeader user={user} />
      <main className="container my-auto min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
