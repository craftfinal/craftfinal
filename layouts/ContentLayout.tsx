// @/components/layout/MarketingContentLayout.tsx

import MainArticleLayoutMDX from "@/layouts/MainArticleLayoutMDX";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import { PropsWithChildren } from "react";

export interface ContentLayoutChildrenProps {
  user: UserAccountOrNullOrUndefined;
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
