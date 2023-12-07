// @/components/layout/MarketingContentLayout.tsx

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { User as PrismaUser } from "@prisma/client";
import { PropsWithChildren } from "react";

export interface MarketingContentLayoutChildrenProps {
  user: PrismaUser | null;
}

interface MarketingContentLayoutProps extends PropsWithChildren {}
export default async function MarketingContentLayout({ children }: Readonly<MarketingContentLayoutProps>) {
  const user = undefined;
  return (
    <>
      <SiteHeader user={user} />
      <main className="container my-auto min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
