// @/components/layout/MarketingContentLayout.tsx

import MainArticleLayoutMDX from "@/layouts/MainArticleLayoutMDX";
import { User as PrismaUser } from "@prisma/client";
import { PropsWithChildren } from "react";

export interface ContentLayoutChildrenProps {
  user: PrismaUser | null;
}

interface ContentLayoutProps extends PropsWithChildren {}
export default async function ContentLayout({ children }: Readonly<ContentLayoutProps>) {
  const user = undefined;
  return (
    <MainArticleLayoutMDX user={user} className="container">
      {children}
    </MainArticleLayoutMDX>
  );
}
