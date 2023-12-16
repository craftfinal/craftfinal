// @/components/layout/MarketingContentLayout.tsx

import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { PropsWithChildren } from "react";
import MainArticleLayoutMDX from "./mdx/MainArticleLayoutMDX";

export interface ContentLayoutChildrenProps {
  account: Base58CheckAccountOrNullOrUndefined;
}

interface ContentLayoutProps extends PropsWithChildren {}
export default async function ContentLayout({ children }: Readonly<ContentLayoutProps>) {
  return <MainArticleLayoutMDX className="container">{children}</MainArticleLayoutMDX>;
  // return <AuthenticatedMainArticleLayoutMDX className="container">{children}</AuthenticatedMainArticleLayoutMDX>;
}
