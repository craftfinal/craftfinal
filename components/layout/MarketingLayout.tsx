// @/components/layout/MarketingMarketingLayout.tsx

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { User as PrismaUser } from "@prisma/client";
import { PropsWithChildren } from "react";

export interface MarketingLayoutChildrenProps {
  user: PrismaUser | null;
}

interface MarketingLayoutProps extends PropsWithChildren {}
export default async function MarketingLayout({ children }: Readonly<MarketingLayoutProps>) {
  const user = undefined;
  return (
    <>
      <SiteHeader user={user} />
      <main className="my-auto min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
