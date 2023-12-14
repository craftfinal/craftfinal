// @/layouts/MarketingLayout.tsx

import MainArticleLayoutMDX, { ArticleLayoutChildrenProps } from "@/layouts/mdx/MainArticleLayoutMDX";
import { MainLayoutProps } from "@/layouts/MainLayout";

export interface MarketingLayoutChildrenProps extends ArticleLayoutChildrenProps {}

interface MarketingLayoutProps extends MainLayoutProps {}
export default async function MarketingLayout({ user, children }: Readonly<MarketingLayoutProps>) {
  return (
    <MainArticleLayoutMDX user={user} className="container">
      {children}
    </MainArticleLayoutMDX>
  );
  // return (
  //   <AuthenticatedMainArticleLayoutMDX user={user} className="container">
  //     {children}
  //   </AuthenticatedMainArticleLayoutMDX>
  // );
}
