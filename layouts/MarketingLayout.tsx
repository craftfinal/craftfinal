// @/layouts/MarketingLayout.tsx

import MainArticleLayoutMDX, { ArticleLayoutChildrenProps } from "@/layouts/MainArticleLayoutMDX";
import { MainLayoutProps } from "@/layouts/MainLayout";

export interface MarketingLayoutChildrenProps extends ArticleLayoutChildrenProps {}

interface MarketingLayoutProps extends MainLayoutProps {}
export default async function MarketingLayout({ user, children }: Readonly<MarketingLayoutProps>) {
  return <MainArticleLayoutMDX user={user}>{children}</MainArticleLayoutMDX>;
}
